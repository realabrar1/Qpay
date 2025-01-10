import React, { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import QRCode from 'react-qr-code';
import { Tab } from '@headlessui/react';
import clsx from 'clsx';

function App() {
  const [upiId, setUpiId] = useState('');
  const [amount, setAmount] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  const generateLink = () => {
    if (!upiId) {
      toast.error('Please enter UPI ID');
      return;
    }

    const upiLink = `upi://pay?pa=${upiId}${amount ? `&am=${amount}` : ''}`;
    setGeneratedLink(upiLink);
    setActiveTab(1);
    toast.success('Payment link generated!');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    toast.success('Link copied to clipboard!');
  };

  const handlePayment = () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      const paymentTimeout = setTimeout(() => {
        toast.error(
          <div>
            <p>No UPI payment app found!</p>
            <div className="mt-2">
              <a 
                href="https://play.google.com/store/apps/details?id=com.google.android.apps.nbu.paisa.user" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                Download Google Pay
              </a>
            </div>
          </div>,
          { duration: 5000 }
        );
      }, 2500);

      window.location.href = generatedLink;

      window.addEventListener('blur', () => {
        clearTimeout(paymentTimeout);
      });
    } else {
      toast(
        <div>
          <p>Please scan the QR code with your mobile UPI app to pay</p>
          <p className="text-sm mt-1">or use the copied link on your mobile device</p>
        </div>,
        { duration: 4000 }
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 max-w-md mx-auto">
      <div className="p-4 pt-8">
        <h1 className="text-4xl font-bold text-center mb-2">Abrar-Pay</h1>
        <p className="text-center text-gray-600 mb-8">Shareable Payment's Link for UPI</p>

        <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
          <Tab.List className="flex space-x-1 rounded-xl bg-white p-1 shadow-sm mb-6">
            <Tab className={({ selected }) =>
              clsx(
                'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                selected
                  ? 'bg-black text-white shadow'
                  : 'text-gray-600 hover:bg-gray-100'
              )
            }>
              Create
            </Tab>
            <Tab className={({ selected }) =>
              clsx(
                'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                selected
                  ? 'bg-black text-white shadow'
                  : 'text-gray-600 hover:bg-gray-100'
              )
            }>
              Pay
            </Tab>
          </Tab.List>

          <Tab.Panels>
            <Tab.Panel>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-6 text-center">
                  Create Shareable Link for UPI Payment
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Enter Your VPA (UPI ID)
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="example@upi"
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount (Optional)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2">₹</span>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0"
                        className="w-full p-2 pl-8 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    onClick={generateLink}
                    className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    CREATE
                  </button>
                </div>
              </div>
            </Tab.Panel>

            <Tab.Panel>
              {generatedLink ? (
                <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                  <div className="bg-white p-4 rounded-lg inline-block mb-4">
                    <QRCode value={generatedLink} size={200} />
                  </div>
                  
                  <p className="text-sm text-gray-500 mb-4">
                    Scan with any UPI app to pay or click the Pay button below
                  </p>
                  
                  <p className="mb-2">
                    You are paying {amount ? `₹${amount}` : 'custom amount'}
                  </p>
                  <p className="text-gray-600 mb-4">to</p>
                  <p className="text-sm mb-6">{upiId}</p>

                  <div className="space-y-3">
                    <button
                      onClick={handlePayment}
                      className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Pay Now
                    </button>

                    <button
                      onClick={copyToClipboard}
                      className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      Copy Payment Link
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  Generate a payment link first
                </div>
              )}
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>

        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>
            If you have any questions about security or privacy,{' '}
            <a href="#" className="text-blue-500">Check our TOS</a>
          </p>
          <p className="mt-4 text-lg font-semibold"># Go Cashless</p>
        </footer>
      </div>
      <Toaster position="bottom-center" />
    </div>
  );
}

export default App;