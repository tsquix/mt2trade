import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Joyride, { ACTIONS, EVENTS, STATUS } from 'react-joyride';
import axios from 'axios';

export default function MarketplaceTour({ setOffersView }) {
  const { data: session } = useSession();
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const steps = [
    {
      target: 'body',
      placement: 'center',
      content: 'Pokażemy Ci jak działa aplikacja',
      disableBeacon: true,
    },
    {
      placement: 'bottom',
      target: '[data-tour="view-ofertydc"]',
      content:
        'Tutaj znajdziesz szczegóły ofert zamieszczanych na serwerach discord',
    },
    {
      placement: 'left-start',
      target: '[data-tour="discord-avatar"]',
      content: 'Aby uzyskać kontakt do właściciela oferty kliknij na avatar!',
    },
    {
      placement: 'left',
      target: '[data-tour="view-oferty"]',
      content: 'Tutaj znajdziesz szczegóły ofert naszych handlarzy',
    },
    {
      placement: 'top',
      target: '[data-tour="buy-now"]',
      content:
        'Jeśli zdecydujesz się na kupno musisz się zalogować! A następnie kliknij kup teraz',
    },
    {
      placement: 'top',
      target: '[data-tour="orders-link"]',
      content:
        'Następnie w zakładce zamówienia możesz śledzić przebieg transakcji!',
    },
  ];
  useEffect(() => {
    const handleStartEvent = () => setRun(true);
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

  // 2. Główna logika sterowania
  const handleJoyrideCallback = async (data) => {
    const { action, index, status, type } = data;

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRun(false);
      // Zapisywanie ukończenia (bez zmian)
      try {
        localStorage.setItem('HAS_SEEN_TOUR', 'true');
        if (session) {
          await axios.patch(`/api/user/me`, { // Changed endpoint
            hasSeenOnboarding: true,
          });
        }
      } catch (error) {
        console.error('Błąd zapisu tour:', error);
      }
      return; // Koniec funkcji
    }

    // Obsługa zmiany kroków
    if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      // Logika przycisku DALEJ
      if (action === ACTIONS.NEXT) {
        if (index === 3) {
          // Zmiana widoku
          setOffersView('oferty');
          // Ważne: Opóźnienie zmiany indeksu, aby React zdążył wyrenderować nowy DOM
          setTimeout(() => {
            setStepIndex(index + 1);
          }, 200); // 200ms zazwyczaj wystarcza
        } else {
          // Normalne przejście
          setStepIndex(index + 1);
        }
      }

      // Logika przycisku WSTECZ
      if (action === ACTIONS.PREV) {
        if (index === 4) {
          // Powrót do poprzedniego widoku
          setOffersView('ofertydc');
          setTimeout(() => {
            setStepIndex(index - 1);
          }, 200);
        } else {
          // Normalne cofnięcie
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
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      disableBeacon={true}
      waitForSelector={true}
      disableOverlayClose={true}
    />
  );
}
