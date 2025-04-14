import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Navigation */}
      <nav style={{
        backgroundColor: 'white',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        position: 'fixed',
        width: '100%',
        zIndex: 50,
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', height: '64px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Link href="/" style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                color: '#2563eb',
                textDecoration: 'none',
              }}>
                RideShare
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{
        position: 'relative',
        backgroundColor: 'white',
        overflow: 'hidden',
        paddingTop: '64px',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{
            position: 'relative',
            zIndex: 10,
            padding: '2rem 1rem',
          }}>
            <main style={{ margin: '2rem auto', maxWidth: '1280px', padding: '0 1rem' }}>
              <div style={{ textAlign: 'left' }}>
                <h1 style={{
                  fontSize: '3.5rem',
                  fontWeight: 800,
                  color: '#1e293b',
                  marginBottom: '1rem',
                }}>
                  <span style={{ display: 'block' }}>Your journey begins</span>
                  <span style={{ display: 'block', color: '#2563eb' }}>with a single tap</span>
                </h1>
                <p style={{
                  marginTop: '1rem',
                  fontSize: '1.25rem',
                  color: '#64748b',
                  maxWidth: '36rem',
                }}>
                  Join our community of riders and drivers. Experience safe, reliable, and comfortable rides at your fingertips.
                </p>
                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                  <Link href="/Signin" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0.75rem 2rem',
                    backgroundColor: '#2563eb',
                    color: 'white',
                    borderRadius: '0.375rem',
                    fontWeight: 500,
                    textDecoration: 'none',
                    transition: 'background-color 0.2s',
                  }}>
                    Sign In
                  </Link>
                  <Link href="/register" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0.75rem 2rem',
                    backgroundColor: '#dbeafe',
                    color: '#1d4ed8',
                    borderRadius: '0.375rem',
                    fontWeight: 500,
                    textDecoration: 'none',
                    transition: 'background-color 0.2s',
                  }}>
                    Register
                  </Link>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '50%',
          height: '100%',
        }}>
          <Image
            src="/assets/background.png"
            alt="Ride sharing illustration"
            width={1000}
            height={1000}
            style={{
              height: '100%',
              width: '100%',
              objectFit: 'cover',
            }}
            priority
          />
        </div>
      </div>

      {/* Features Section */}
      <div style={{
        padding: '3rem 0',
        backgroundColor: '#f8fafc',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{
              fontSize: '0.875rem',
              color: '#2563eb',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>Features</h2>
            <p style={{
              marginTop: '0.5rem',
              fontSize: '2.25rem',
              fontWeight: 800,
              color: '#1e293b',
            }}>
              A better way to travel
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2.5rem',
          }}>
            {/* Feature 1 */}
            <div style={{ flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                flex: '0 0 auto',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '3rem',
                height: '3rem',
                borderRadius: '9999px',
                backgroundColor: '#2563eb',
                color: 'white',
              }}>
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <h3 style={{ marginTop: '1rem', fontSize: '1.5rem', fontWeight: 500, color: '#1e293b' }}>Fast Pickup</h3>
              <p style={{ marginTop: '0.5rem', fontSize: '1.25rem', color: '#64748b' }}>
                Get picked up within minutes of booking your ride.
              </p>
            </div>

            {/* Feature 2 */}
            <div style={{ flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                flex: '0 0 auto',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '3rem',
                height: '3rem',
                borderRadius: '9999px',
                backgroundColor: '#2563eb',
                color: 'white',
              }}>
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 style={{ marginTop: '1rem', fontSize: '1.5rem', fontWeight: 500, color: '#1e293b' }}>Safe & Secure</h3>
              <p style={{ marginTop: '0.5rem', fontSize: '1.25rem', color: '#64748b' }}>
                All drivers are verified with Aadhar for your safety.
              </p>
            </div>

            {/* Feature 3 */}
            <div style={{ flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                flex: '0 0 auto',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '3rem',
                height: '3rem',
                borderRadius: '9999px',
                backgroundColor: '#2563eb',
                color: 'white',
              }}>
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 style={{ marginTop: '1rem', fontSize: '1.5rem', fontWeight: 500, color: '#1e293b' }}>Affordable Rates</h3>
              <p style={{ marginTop: '0.5rem', fontSize: '1.25rem', color: '#64748b' }}>
                Competitive pricing with no hidden charges.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
