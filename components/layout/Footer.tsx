import Link from 'next/link';

/**
 * Footer Component
 * 토스 스타일의 전역 푸터
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              ROA Finance
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              금융 지식을 쉽고 명확하게.
              <br />
              ROA Finance는 금리, 대출, 투자에 대한 실용적인 금융 정보를 제공합니다.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
              탐색
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  홈
                </Link>
              </li>
              <li>
                <Link
                  href="/?filter=all"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  시리즈
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
              법적 고지
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            © {currentYear} ROA Finance. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
