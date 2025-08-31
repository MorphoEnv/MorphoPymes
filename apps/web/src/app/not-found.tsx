import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404 — Page not found</h1>
        <p className="text-gray-600 mb-6">Sorry, we couldn&apos;t find the page you&apos;re looking for.</p>
        <Link href="/" className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg">Back to home</Link>
      </div>
    </div>
  );
}
