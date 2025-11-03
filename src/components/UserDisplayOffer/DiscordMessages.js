import React, { useState, useEffect, useRef } from 'react';

const DiscordMessages = ({ offer }) => {
  const [zoomedImg, setZoomedImg] = useState(null);
  const [showBottomBtn, setShowBottomBtn] = useState(false);
  const messagesEndRef = useRef();
  const containerRef = useRef();

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest',
      });
    }
  };

  useEffect(() => {
    const div = containerRef.current;
    if (!div) return;

    let lastScrollTop = div.scrollTop;
    const threshold = 5;
    //flag to prevent multiple invokes when scroll changes
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const st = div.scrollTop;
          const delta = st - lastScrollTop;
          lastScrollTop = st;

          const maxScrollY = div.scrollHeight - div.clientHeight;
          const distanceFromBottom = maxScrollY - st;

          // update kierunku scrolla
          const direction =
            Math.abs(delta) < threshold ? null : delta > 0 ? 'down' : 'up';

          // update przycisku
          if (direction === 'up' || distanceFromBottom <= 150) {
            setShowBottomBtn(false);
          } else if (direction === 'down' && distanceFromBottom > 150) {
            setShowBottomBtn(true);
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    div.addEventListener('scroll', handleScroll);
    return () => div.removeEventListener('scroll', handleScroll);
  }, []);

  // useEffect(() => {
  //   console.log(scrollDir);
  // }, [scrollDir]);
  return (
    <div
      className="text-white rounded-xl p-4 py-8 shadow-md relative custom-scrollbar"
      ref={containerRef}
      style={{
        overflowY: 'auto',
        maxHeight: '80vh',
      }}
    >
      <div className="">
        <div className="flex items-center gap-2 bg-mainBg p-2 rounded-lg">
          <img
            src={offer?.seller?.avatar?.url}
            alt={offer?.seller?.displayName}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h2 className="font-semibold text-[#dcddde]">
              {offer?.seller?.displayName}
              <span className="text-[#72767d] text-sm ml-1">
                • {new Date(offer?.createdAt).toLocaleDateString()}
              </span>
            </h2>
            <p className="text-sm text-[#b9bbbe]">
              Offer: <span className="text-[#00b0f4]">{offer?.title}</span> (
              {offer?.offerType.toUpperCase()})
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3 ">
        {/* TODO dodac doscrolowanie do 100vgh zeby przycisk zawsze byl 100 procentach widoczny a nie np w polowie / 1/3 */}
        <div
          className={`z-50 sticky top-[70vh] w-full flex justify-center transition-all duration-300 ${
            showBottomBtn
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-10'
          }`}
        >
          <button
            className="bg-red-300 px-4 py-1 rounded "
            onClick={scrollToBottom}
          >
            Skocz do najnowszych
          </button>
        </div>
        <div className="border-t border-[#202225]"></div>
        {offer?.ownerMessages?.map((msg) => (
          <div
            key={msg.id}
            className="flex items-start gap-3 hover:bg-[#36393f] p-2 rounded-md transition-colors"
          >
            <img
              src={offer?.seller?.avatar?.url}
              alt="avatar"
              className="w-8 h-8 rounded-full mt-1"
            />
            <div className="w-full max-w-lg">
              <div className="flex items-center gap-1">
                <span className="font-medium text-[#dcddde]">
                  {offer?.seller?.displayName}
                </span>
                <span className="text-xs text-[#72767d]">
                  {new Date(msg.timestamp).toDateString() ===
                  new Date().toDateString()
                    ? ''
                    : new Date(msg.timestamp).toLocaleDateString()}
                </span>
                <span className="text-xs text-[#72767d]">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                  })}
                </span>
              </div>
              <p className="whitespace-pre-wrap break-words w-full text-[#b9bbbe] leading-snug">
                {msg.content}
              </p>

              {msg.attachments?.length > 0 && (
                <div className="mt-2 space-y-2">
                  {msg.attachments.map((att, i) => (
                    <img
                      key={i}
                      src={att.url}
                      alt={`attachment-${i}`}
                      className="max-h-64 border border-[#202225] cursor-pointer transition-transform hover:scale-105 z-10"
                      onClick={() => setZoomedImg(att.url)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Fullscreen Zoom */}
      {zoomedImg && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 cursor-zoom-out"
          onClick={() => setZoomedImg(null)}
        >
          <img
            src={zoomedImg}
            alt="Zoomed"
            className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-lg transition-transform scale-100 hover:scale-[1.02]"
          />
        </div>
      )}
    </div>
  );
};

export default DiscordMessages;
