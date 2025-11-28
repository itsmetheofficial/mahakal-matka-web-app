import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";


const Help = () => {

  let { appData } = useSelector((state) => state.appData.appData);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState({ title: "", content: "" });

  // Function to convert 24-hour time to 12-hour format with AM/PM
  const convertTo12Hour = (time24) => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  // Function to check if current time is within support hours
  const isWithinSupportHours = () => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const openTime = appData?.support_open_time || '10:00:00';
    const closeTime = appData?.support_close_time || '22:00:00';

    const [openHour, openMin] = openTime.split(':').map(Number);
    const [closeHour, closeMin] = closeTime.split(':').map(Number);

    const openMinutes = openHour * 60 + openMin;
    const closeMinutes = closeHour * 60 + closeMin;

    return currentTime >= openMinutes && currentTime <= closeMinutes;
  };

  // Handle whatsapp chat click
  const handleWhatsAppChatClick = (e) => {
    e.preventDefault();
    setDialogMessage({
      title: "WhatsApp Chat Notice",
      content: `
        <div class="text-center px-2">
          <div class="mb-4">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-3">
              <i class="fas fa-clock text-orange-500 text-2xl"></i>
            </div>
            <p class="text-gray-700 text-base mb-2">WhatsApp chat replies may take longer.</p>
            <p class="text-sm text-gray-500">व्हाट्सएप चैट में जवाब मिलने में समय लग सकता है।</p>
          </div>
          <div class="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
            <p class="text-green-700 font-semibold text-sm mb-1">For Quick Response:</p>
            <p class="text-gray-600 text-xs">Use Withdrawal or Deposit Chat buttons</p>
          </div>
          <div class="flex gap-2 justify-center">
            <button onclick="document.querySelector('.dialog-close-btn').click()" class="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2.5 rounded-lg font-medium transition-colors">
              Go Back
            </button>
            <a href="${appData?.whatsapp_number}" class="flex-1 bg-[#2ed838] hover:bg-[#26b82f] text-white px-4 py-2.5 rounded-lg font-medium transition-all text-center">
              Continue
            </a>
          </div>
        </div>
      `
    });
    setShowDialog(true);
  };

  // Handle telegram chat click
  const handleTelegramChatClick = (e) => {
    e.preventDefault();
    setDialogMessage({
      title: "Telegram Chat Notice",
      content: `
        <div class="text-center px-2">
          <div class="mb-4">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-3">
              <i class="fas fa-clock text-orange-500 text-2xl"></i>
            </div>
            <p class="text-gray-700 text-base mb-2">Telegram chat replies may take longer.</p>
            <p class="text-sm text-gray-500">टेलीग्राम चैट में जवाब मिलने में समय लग सकता है।</p>
          </div>
          <div class="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
            <p class="text-green-700 font-semibold text-sm mb-1">For Quick Response:</p>
            <p class="text-gray-600 text-xs">Use Withdrawal or Deposit Chat buttons</p>
          </div>
          <div class="flex gap-2 justify-center">
            <button onclick="document.querySelector('.dialog-close-btn').click()" class="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2.5 rounded-lg font-medium transition-colors">
              Go Back
            </button>
            <a href="${appData?.telegram_chat_link}" class="flex-1 bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:from-[#5568d3] hover:to-[#6a3f91] text-white px-4 py-2.5 rounded-lg font-medium transition-all text-center">
              Continue
            </a>
          </div>
        </div>
      `
    });
    setShowDialog(true);
  };

  // Handle chat button clicks
  const handleChatClick = (e, type) => {
    if (!isWithinSupportHours()) {
      e.preventDefault();
      const openTime12 = convertTo12Hour(appData?.support_open_time);
      const closeTime12 = convertTo12Hour(appData?.support_close_time);
      setDialogMessage({
        title: "Support Hours",
        content: `
          <div class="text-center">
            <p class="text-red-600 font-bold mb-1">समर्थन समय समाप्त हो गया है</p>
            <p class="text-gray-700 mb-3">Support hours have ended</p>
            <p class="text-gray-600 mb-1">कृपया अगले दिन संपर्क करें</p>
            <p class="text-gray-500 mb-3">Please contact us tomorrow</p>
            <p class="text-sm text-gray-500 mb-4">Support Hours: ${openTime12} - ${closeTime12}</p>
            <button onclick="document.querySelector('.dialog-close-btn').click()" class="bg-gray-600 hover:bg-gray-700 text-white px-8 py-2 rounded-lg font-semibold transition-colors">
              Close
            </button>
          </div>
        `
      });
      setShowDialog(true);
    }
  };


  return (
    <div className="relative p-3 pb-8 text-sm">
      {/* Dialog */}
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-11/12 mx-4 overflow-hidden">
            <div className="bg-gradient-to-r from-orange to-red-500 p-4">
              <h3 className="text-white text-lg font-bold text-center">{dialogMessage.title}</h3>
            </div>
            <div className="p-6">
              <div dangerouslySetInnerHTML={{ __html: dialogMessage.content }}></div>
            </div>
          </div>
          {/* Hidden button for onclick handlers to reference */}
          <button
            onClick={() => setShowDialog(false)}
            className="dialog-close-btn hidden"
          />
        </div>
      )}

      <span
        dangerouslySetInnerHTML={{
          __html: appData?.custom_message_3_help_page_1,
        }}
      ></span>

      {/* Withdrawal and Deposit Chat Buttons - Priority Section */}
      <div className="mt-5 mb-3">
        <div className="text-center mb-3">
          <span className="inline-block bg-green-500 text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-md">
            ⚡ Quick Response
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <Link
            to="/withdrawal-chat"
            onClick={(e) => handleChatClick(e, 'withdrawal')}
            className="relative h-[60px] flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
            <i className="fas fa-money-bill-wave text-lg"></i>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-bold">Withdrawal Chat</span>
              <span className="text-xs opacity-90">निकासी चैट</span>
            </div>
          </Link>

          <Link
            to="/deposit-chat"
            onClick={(e) => handleChatClick(e, 'deposit')}
            className="relative h-[60px] flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
            <i className="fas fa-wallet text-lg"></i>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-bold">Deposit Chat</span>
              <span className="text-xs opacity-90">जमा चैट</span>
            </div>
          </Link>
        </div>

        {/* Improved descriptive text */}
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="bg-red-50 p-2.5 rounded-md border border-red-200">
            <p className="text-xs text-gray-700 leading-relaxed">
              पैसे निकालने में अगर कोई समस्या है तो <span className="font-semibold text-red-600">Withdrawal Chat</span> पे क्लिक करे।
            </p>
          </div>
          <div className="bg-green-50 p-2.5 rounded-md border border-green-200">
            <p className="text-xs text-gray-700 leading-relaxed">
              पैसे जमा करने में अगर आपको समस्या है तो <span className="font-semibold text-green-600">Deposit Chat</span> पे क्लिक करे।
            </p>
          </div>
        </div>
      </div>

      {/* Other Contact Options */}
      <div className="flex justify-center items-center gap-2 mt-6 pb-4 pt-3 border-b border-t border-black/40">
        {
          appData?.whatsapp_enable ?
            <a href={appData?.whatsapp_number} onClick={handleWhatsAppChatClick} className="shadow-md rounded-lg w-1/2 h-[50px] flex items-center justify-center gap-2 p-2 border-[3px] border-[#fff] bg-[#2ed838] hover:shadow-xl transition-shadow duration-300">
              <i className="fab fa-whatsapp" style={{ fontSize: "20px" }}></i>
              <span className="text-white text-[12px] font-extrabold">WhatsApp Us</span>
            </a>
            : null
        }
        {
          appData?.telegram_chat_link && appData?.telegram_chat_link.trim() !== "" ?
            <a
              href={appData?.telegram_chat_link}
              onClick={handleTelegramChatClick}
              className="shadow-md rounded-lg w-1/2 h-[50px] flex items-center justify-center gap-2 p-2 border-[3px] border-[#fff] bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:shadow-xl transition-shadow duration-300"
            >
              <i className="fab fa-telegram text-white border-2 border-white rounded-full p-1" style={{ fontSize: "22px" }}></i>
              <div className="flex flex-col leading-tight">
                <span className="text-white text-[14px] font-extrabold">Chat on</span>
                <span className="text-white text-[14px] font-extrabold">Telegram</span>
              </div>
            </a>
            : null
        }
        {/* {
          appData?.telegram_enable ?
            <a href={appData?.telegram_link} className="shadow-md rounded-lg w-1/2 h-[50px] flex items-center justify-center gap-2 p-2 border-[3px] border-[#fff] bg-[#2eb9d8] hover:shadow-xl transition-shadow duration-300">
              <i className="fab fa-telegram " style={{ fontSize: "20px" }}></i>
              <span className="text-white text-[12px] font-extrabold">Join Telegram</span>
            </a>
            : null
        } */}
      </div>

    </div>
  );
};

export default Help;
