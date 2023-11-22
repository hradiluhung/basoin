import Link from "next/link"

export default function NotFound() {
  return (
    <>
      <div className="flex items-center justify-center w-screen h-screen">
        <div className="px-4 lg:py-12">
          <div className="lg:gap-4 lg:flex">
            <div className="flex flex-col items-center justify-center md:py-24 lg:py-32">
              <h1 className="font-bold text-blue-600 text-9xl">404</h1>
              <p className="mb-2 text-2xl font-bold text-center text-gray-800 md:text-3xl">
                <span className="text-red-500">Oops!</span>{" "}
              </p>
              <p className="mb-8 text-center text-gray-500 md:text-lg">
                Halaman yang anda cari tidak ditemukan.
              </p>
              <Link
                href="/"
                className="px-5 py-2 rounded-md text-blue-100 bg-blue-600 hover:bg-blue-700"
              >
                Balik ke Beranda
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
