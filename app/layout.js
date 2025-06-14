import './globals.css'
import Header from '../components/Header'
import Footer from '../components/Footer'

export const metadata = {
  title: 'Classic Jobs - Top IT Jobs For Freshers',
  description: 'Find top IT jobs for freshers at Classic Jobs. Explore BCA, BSc, MCA, BE, BTech, MBA, MSc, BCom, MCom & Diploma opportunities. Start your journey now!',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}