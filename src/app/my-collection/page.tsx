export default function MyCollection() {

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
    <div className="mb-6">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-blue-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    </div>
    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-4">
      My Collection <span className="text-blue-600">Coming Soon</span>
    </h1>
    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 max-w-2xl w-full">
      <div className="flex items-center">
      </div>
    </div>
  </div>
  );
}
