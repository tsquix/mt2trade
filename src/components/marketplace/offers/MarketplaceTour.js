import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Joyride, { ACTIONS, EVENTS, STATUS } from 'react-joyride';
import axios from 'axios';

export default function MarketplaceTour({ setOffersView }) {
  const { data: session } = useSession();
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  //prevent scroll snap when tour is running
  useEffect(() => {
    if (run) {
      document.documentElement.classList.add('no-scroll-snap');
    } else {
      document.documentElement.classList.remove('no-scroll-snap');
    }
  }, [run]);

  const steps = [
    {
      target: 'body',
      placement: 'center',
      content: 'Cześć! Pokażemy Ci szybko, jak poruszać się po markecie.',
      disableBeacon: true,
    },
    {
      placement: 'bottom',
      target: '[data-tour="view-ofertydc"]',
      content:
        'Tutaj lądują wszystkie ogłoszenia bezpośrednio z serwerów Discord.',
    },
    {
      placement: 'left-start',
      target: '[data-tour="discord-avatar"]',
      content:
        'Zainteresowany? Kliknij w avatar, aby złapać kontakt z właścicielem oferty.',
    },
    {
      placement: 'left',
      target: '[data-tour="view-oferty"]',
      content: 'Tutaj znajdziesz oferty od naszych najlepszych handlarzy.',
    },
    {
      placement: 'left-start',
      target: '[data-tour="buy-now"]',
      content:
        'Aby kupić przedmiot, musisz być zalogowany. Potem wystarczy jedno kliknięcie "Kup teraz"!',
    },
    {
      placement: 'top',
      target: '[data-tour="orders-link"]',
      content:
        'Tutaj znajdziesz historię swoich zakupów i sprawdzisz status aktualnych zamówień.',
    },
  ];
  useEffect(() => {
    const handleStartEvent = () => {
      setStepIndex(0);
      setRun(true);
    };
    window.addEventListener('start-onboarding', handleStartEvent);

    const checkOnboarding = async () => {
      const hasSeenLocal = localStorage.getItem('HAS_SEEN_TOUR');
      if (!hasSeenLocal) {
        if (!session) {
          setRun(true);
        } else {
          try {
            const res = await axios.get('/api/user/me');
            if (!res.data.user.hasSeenOnboarding) setRun(true);
          } catch (e) {
            console.error(e);
          }
        }
      }
    };
    if (session !== undefined) checkOnboarding();
    return () =>
      window.removeEventListener('start-onboarding', handleStartEvent);
  }, [session]);

  const handleJoyrideCallback = async (data) => {
    const { action, index, status, type } = data;

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRun(false);
      // Zapisywanie ukończenia (bez zmian)
      try {
        localStorage.setItem('HAS_SEEN_TOUR', 'true');
        if (session) {
          await axios.patch(`/api/user/me`, {
            // Changed endpoint
            hasSeenOnboarding: true,
          });
        }
      } catch (error) {
        console.error('Błąd zapisu tour:', error);
      }
      return; // Koniec funkcji
    }
    if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      if (action === ACTIONS.NEXT) {
        if (index === 3) {
          setOffersView('oferty');

          setTimeout(() => {
            setStepIndex(index + 1);
          }, 200);
        } else {
          setStepIndex(index + 1);
        }
      }

      if (action === ACTIONS.PREV) {
        if (index === 4) {
          setOffersView('ofertydc');
          setTimeout(() => {
            setStepIndex(index - 1);
          }, 200);
        } else {
          setStepIndex(index - 1);
        }
      }
    }
  };

  return (
    <Joyride
      run={run}
      steps={steps}
      stepIndex={stepIndex}
      continuous
      showSkipButton
      callback={handleJoyrideCallback}
      disableBeacon={true}
      waitForSelector={true}
      disableOverlayClose={true}
      locale={{
        back: 'Wstecz',
        close: 'Zamknij',
        last: 'Zakończ',
        next: 'Dalej',
        skip: 'Pomiń',
      }}
    />
  );
}
