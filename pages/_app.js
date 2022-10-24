import "../styles/globals.css"

function MyApp({ Component, pageProps }) {
  return (
    <>
      {" "}
      <style jsx global>{`
        /* Other global styles such as 'html, body' etc... */

        #__next {
          height: 100%;
        }
      `}</style>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
