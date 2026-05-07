function MatchRequestCard({ dog, onAccept, onReject, onView }) {

  return (

    <div className="card shadow-sm v-100 border-0"
    style={{
      borderRadius:'25px',
      overflow:'hidden',
    }}>

      <div className="position-relative">

        {/* badge match in alto a sinistra */}

        <div className="position-absolute top-0 start-0 m-3 badge rounded-pill px-3 py-2 fw-bold"
        style={{
          backgroundColor: 'rgba(74, 124, 89, 0.9)',
          zIndex:2,
          fontSize:'0.8rem'
        }}>
          95%
          </div>

          {/* pulsante cuore in alto a destra */}
            <button
              className="btn btn-white position-absolute top-0 end-0 m-3 rounded-circle shadow-sm

              d-flex align-items-center justify-content-center"

              style={{

                width:'36px',

                height:'36px',

                backgroundColor:'white',

                border:'none',

                zIndex:2,

                padding:'0'

              }}>

              <i className="bi bi-heart text-muted"></i>

            </button>



           <img

           src={dog.photo}

           className="card-img-top"

           alt={dog.name}

           style={{

            height:'200px',

            objectFit:'cover',

            cursor:'pointer'

           }}

           onClick={() => onView(dog)}

           />

          </div>



          <div className="card-body p-3">

            <div className="d-flex justify-content-between align-items-start mb-1">

              <div>

                <h6 className="fw-bold mb-0"

                style={{

                  fontSize: '1.1rem'

                }}>{dog.name}</h6>

                <div className="text-muted small">

                  {dog.breed}

                </div>

              </div>

              <div className="text-muted small">

                <i className="bi bi-geo-alt-fill text-bg-danger me-1"></i>

                {dog.distance}

              </div>

               </div>



              <div className="text-muted small mb-2">
                {dog.eta != null ? `${dog.eta} ${dog.eta === 1 ? 'anno' : 'anni'}` : ''}
                {dog.sesso ? ` · ${dog.sesso === 'M' ? 'Maschio' : 'Femmina'}` : ''}
              </div>

              {/* Bio del cane */}
              {dog.descrizione && (
                <div className="mb-3">
                  <p className="small fw-semibold mb-1" style={{ color: "#7FBCC8" }}>Bio del cane</p>
                  <p className="text-muted small mb-0"
                    style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {dog.descrizione}
                  </p>
                </div>
              )}

                {/* tag piccoli grigi */}

                <div className="d-flex gap-1 mb-3">

                  <span className="badge bg-light text-muted border rounded-pill px-2 py-1"

                  style={{

                    fontSize: '0.6rem',

                    fontWeight: '500'

                  }}>

                    <i className="bi bi-check-fill text-success me-1"></i>

                    Pedigree

                  </span>



                  <span className="badge bg-light text-muted border rounded-pill px-2 py-1"

                   style={{

                    fontSize: '0.6rem',

                    fontWeight: '500'

                  }}>

                    <i className="bi bi-check-fill text-success me-1"></i>

                    Genetica

                  </span>

                </div>

             

              {/* pulsanti azione */}

               <div className="d-flex gap-2">



                 

          <button

            className="btn btn-outline-light text-dark border flex-grow-1 rounded-pill btn-sm fw-bold"

            onClick={() => onReject(dog.id)}

          >

            Rifiuta

            <i className="bi bi-heartbreak"></i>

          </button>



          <button

            className="btn flex-grow-1 rounded-pill btn-sm fw-bold shadow-sm text-white"

            style={{

              backgroundColor:'#4CAF50',

              border:'none'

            }}

            onClick={() => onAccept(dog.id)}

          >

            Match

          </button>



        </div>

        </div>

     

    </div>

  );

}



export default MatchRequestCard;