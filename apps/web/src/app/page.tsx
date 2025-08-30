export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Hero Section */}
      <section className="relative px-6 py-20 sm:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
                <span className="block">Democratizando las</span>
                <span className="block bg-gradient-to-r from-blue-500 via-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Micro-inversiones
                </span>
              </h1>
              <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Conectamos emprendedores latinoamericanos con inversores globales a través de 
                <span className="font-semibold text-blue-600"> DeFi</span> y 
                <span className="font-semibold text-blue-700"> ENS</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <button className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center space-x-3">
                <span>Comenzar a Invertir</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5-5 5M6 12h12" />
                </svg>
              </button>
              <button className="border border-blue-300 text-blue-700 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-blue-50 hover:shadow-lg transition-all duration-300">
                Solicitar Financiamiento
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-20 max-w-4xl mx-auto">
            <div className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-200/50">
              <div className="text-3xl font-bold text-blue-600">$10</div>
              <div className="text-gray-600 font-medium">Inversión mínima</div>
            </div>
            <div className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-200/50">
              <div className="text-3xl font-bold text-blue-700">100%</div>
              <div className="text-gray-600 font-medium">Transparente</div>
            </div>
            <div className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-200/50">
              <div className="text-3xl font-bold text-blue-800">DeFi</div>
              <div className="text-gray-600 font-medium">Tecnología</div>
            </div>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-50 float-animation"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-blue-300 rounded-full opacity-50 float-animation" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-blue-400 rounded-full opacity-50 float-animation" style={{animationDelay: '2s'}}></div>
      </section>

      {/* Features Preview */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16 text-gray-900">
            ¿Cómo funciona MorphoPymes?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Invierte fácil</h3>
              <p className="text-gray-600">Desde $10 puedes invertir en PYMEs verificadas con contratos inteligentes</p>
            </div>

            <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">100% Transparente</h3>
              <p className="text-gray-600">Cada proyecto tiene su ENS propio y smart contracts auditables</p>
            </div>

            <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Impacto Real</h3>
              <p className="text-gray-600">Apoya el crecimiento de emprendedores y genera retornos sostenibles</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
