import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function TermsAgreement({ agreed, setAgreed }) {
  const [language, setLanguage] = useState("ar");
  const [modalOpen, setModalOpen] = useState(false);
  const dialogRef = useRef(null);
  const dialogContentRef = useRef(null);

  const pdfPath =
    language === "en" ? "/TAFAWOUQ-GEV_ENG.pdf" : "/TAFAWOUQ-GEV-Ar.pdf";

  // Handle escape key press to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeModal();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Handle click outside modal to close it
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dialogRef.current &&
        dialogContentRef.current &&
        !dialogContentRef.current.contains(e.target)
      ) {
        closeModal();
      }
    };

    if (modalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalOpen]);

  const openModal = () => {
    dialogRef.current?.showModal();
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setTimeout(() => dialogRef.current?.close(), 200);
  };

  return (
    <>
      <div className="my-6 bg-white p-5 rounded-lg shadow-md border border-gray-200">
        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-md border border-gray-100">
          <input
            id="agree"
            name="agree"
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="w-5 h-5 accent-TAF-300 cursor-pointer"
          />
          <label
            htmlFor="agree"
            className="text-sm font-medium cursor-pointer select-none"
          >
            {language === "ar"
              ? "أوافق على جميع الشروط والأحكام"
              : "I agree to the terms and conditions"}
          </label>
          <button
            type="button"
            onClick={openModal}
            className="mr-auto text-TAF-100 hover:text-TAF-400 text-sm font-medium underline transition-colors"
          >
            {language === "ar"
              ? "عرض الشروط والأحكام"
              : "View Terms & Conditions"}
          </button>
        </div>
      </div>

      {/* Terms and Conditions Modal */}
      <dialog
        ref={dialogRef}
        className="w-full max-w-3xl bg-white shadow-2xl rounded-2xl p-0 backdrop:bg-black backdrop:bg-opacity-50"
      >
        <AnimatePresence>
          {modalOpen && (
            <motion.div
              ref={dialogContentRef}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="w-full p-4"
            >
              <div className="flex justify-between items-center pb-3">
                <h2 className="text-xl font-semibold text-TAF-100">
                  {language === "en"
                    ? "Terms and Conditions"
                    : "الشروط والأحكام"}
                </h2>
                <button onClick={closeModal} className="text-gray-500 text-xl">
                  &times;
                </button>
              </div>

              <div className="flex justify-center gap-3 mb-4">
                <button
                  type="button"
                  className={`px-5 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    language === "ar"
                      ? "bg-TAF-100 text-white shadow-md"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                  onClick={() => setLanguage("ar")}
                >
                  العربية
                </button>
                <button
                  type="button"
                  className={`px-5 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    language === "en"
                      ? "bg-TAF-100 text-white shadow-md"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                  onClick={() => setLanguage("en")}
                >
                  English
                </button>
              </div>

              <div className="border rounded-lg overflow-hidden h-[450px] mb-5 shadow-inner bg-gray-50">
                <iframe
                  src={`${pdfPath}#toolbar=0&navpanes=0&scrollbar=1`}
                  className="w-full h-full"
                  title="Terms PDF"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-TAF-100 text-white rounded-lg hover:bg-TAF-400 transition-colors"
                >
                  {language === "ar" ? "إغلاق" : "Close"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </dialog>
    </>
  );
}
