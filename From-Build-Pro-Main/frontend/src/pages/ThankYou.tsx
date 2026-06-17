import { useLocation } from "react-router-dom";

const ThankYou = () => {
  const location = useLocation();
  const formTitle = location.state?.formTitle || "Form";

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted dark:bg-card">
      <div className=" dark:bg-muted shadow-xl rounded-2xl p-8 max-w-lg text-center">
        
        {/* Logo / Title */}
        <h1 className="text-3xl font-bold text-#2563eb -600 mb-2">
          LiftupForms
        </h1>

        {/* Success Message */}
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Response Submitted ✅
        </h2>

        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Thank you for submitting the <b>{formTitle}</b>.
        </p>

        {/* Extra Info */}
        <p className="text-sm text-muted-foreground mt-4">
          Your response has been recorded successfully.
        </p>

        {/* Optional Button */}
        <button
          onClick={() => window.location.href = "/"}
          className="mt-6 bg-blue-600 text-2563eb  px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default ThankYou;