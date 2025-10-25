import React, { useState, useEffect } from 'react';

const DiscordMessages = ({ offer }) => {
  const [zoomedImg, setZoomedImg] = useState(null);

  useEffect(() => {
    console.log(offer);
  }, [offer]);

  return (
    <div className="text-white rounded-xl p-4 py-8 shadow-md relative">
      <div className="mb-3 pb-2 border-b border-[#202225]">
        <div className="flex items-center gap-2">
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

      <div className="space-y-3">
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
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-[#dcddde]">
                  {offer?.seller?.displayName}
                </span>
                <span className="text-xs text-[#72767d]">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <p className="whitespace-pre-wrap text-[#b9bbbe] leading-snug">
                {msg.content}
              </p>

              {msg.attachments?.length > 0 && (
                <div className="mt-2 space-y-2">
                  {msg.attachments.map((att, i) => (
                    <img
                      key={i}
                      src={att.url}
                      alt={`attachment-${i}`}
                      className="max-h-64 rounded-md border border-[#202225] cursor-pointer transition-transform hover:scale-[1.02]"
                      onClick={() => setZoomedImg(att.url)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
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
