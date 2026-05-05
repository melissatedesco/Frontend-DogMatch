const MatchAnimation = () => {
    return (
        <>
        <div style={{
            position:'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height:'100vh',
            background: 'linear-gradient(135deg,rgba(127, 188, 200, 0.95), rgba(239, 166, 186, 0.95)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent:'center',
            alignItems: 'center',
            zIndex: 9999,
            color: 'white',
            backdropFilter: 'blur(10px)'
        }}>

            {/* Icona cuore animata */}
            <div style={{
                fontSize: '100px',
                animation:'pulse 1.5s infinite'
            }}>
                ❤️
            </div>

            <h1 style={{
                fontSize: '4rem',
                fontWeight: 'bold',
                textShadow:'2px 2px 10px rbga(0,0,0,0.2)',
                fontFamily:'cursive'
            }}>
                It's Match!
            </h1>
      

        <p style={{
            fontSize: '1.5rem',
            marginTop: '10px'
            }}>
            Hai trovato un nuovo amico a quattro zampe</p>
            </div>

            {/* CSS per l'animazione */}
            <style>
                {`
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.2); }
                    100% { transform: scale(1); }
                }
                `}
            </style>
        </>

    )
}

export default MatchAnimation