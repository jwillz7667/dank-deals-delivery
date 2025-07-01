"use client"

import Image from 'next/image'
import Link from 'next/link'

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-app-bg via-app-secondary to-app-accent flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="glass-card bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 text-center">
          {/* Logo */}
          <div className="mb-6">
            <Image
              src="/DANKDEALSMN.COM-LOGO.png"
              alt="DankDealsMN"
              width={150}
              height={75}
              className="mx-auto"
              priority
            />
          </div>

          {/* Offline Icon */}
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 5.636l-12.728 12.728m0-12.728l12.728 12.728M8 12h8"
                />
              </svg>
            </div>
          </div>

          {/* Content */}
          <h1 className="text-2xl font-bold text-app-green-800 mb-4">
            You're Offline
          </h1>
          
          <p className="text-gray-600 mb-6">
            Looks like you've lost your internet connection. Please check your network settings and try again.
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-app-green-600 hover:bg-app-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              aria-label="Retry loading the page"
            >
              Try Again
            </button>

            <Link
              href="/"
              className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Go to Homepage
            </Link>
          </div>

          {/* Offline Features */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">
              While you're offline:
            </h2>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-center">
                <svg className="w-4 h-4 text-app-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Your cart is saved locally
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-app-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Previous pages are cached
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-app-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Settings are preserved
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Need immediate assistance?
            </p>
            <a
              href="tel:+16129301390"
              className="text-app-green-600 font-semibold text-sm hover:text-app-green-700"
            >
              Call (612) 930-1390
            </a>
          </div>
        </div>

        {/* Connection Status */}
        <div className="mt-4 text-center">
          <div id="connection-status" className="text-sm text-gray-500">
            <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2"></span>
            No Internet Connection
          </div>
        </div>
      </div>

      {/* JavaScript for connection detection */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            function updateConnectionStatus() {
              const statusElement = document.getElementById('connection-status');
              if (navigator.onLine) {
                statusElement.innerHTML = '<span class="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>Back Online - Reloading...';
                setTimeout(() => window.location.reload(), 1000);
              } else {
                statusElement.innerHTML = '<span class="inline-block w-2 h-2 bg-red-500 rounded-full mr-2"></span>No Internet Connection';
              }
            }

            // Check connection status on load
            updateConnectionStatus();

            // Listen for connection changes
            window.addEventListener('online', updateConnectionStatus);
            window.addEventListener('offline', updateConnectionStatus);

            // Periodic check every 5 seconds
            setInterval(() => {
              if (navigator.onLine) {
                updateConnectionStatus();
              }
            }, 5000);
          `
        }}
      />
    </div>
  )
} 