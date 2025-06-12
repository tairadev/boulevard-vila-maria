import React, { useState, useRef } from 'react'
import { toJpeg } from 'html-to-image'
import './App.css'

function App() {
  const [number, setNumber] = useState('13')
  const [block, setBlock] = useState('B1')
  const cardRef = useRef(null)

  const handleDownload = () => {
    const node = cardRef.current
    if (!node) return

    toJpeg(node, {
      quality: 1,
      backgroundColor: 'white', // garante fundo branco
      style: {
        width: '600px',
        height: '800px',
      },
      width: 600,
      height: 800,
    })
      .then((dataUrl) => {
        const link = document.createElement('a')
        link.download = `cartao-${number}-${block}.jpg`
        link.href = dataUrl
        link.click()
      })
      .catch((error) => {
        console.error('Erro ao exportar imagem:', error)
      })
  }

  const handlePrintAsImage = async () => {
  const node = cardRef.current
  if (!node) return

  try {
    const dataUrl = await toJpeg(node, {
      quality: 1,
      backgroundColor: 'white',
      width: 600,
      height: 800,
    })

    const printWindow = window.open('', '_blank', 'width=600,height=800')
    if (!printWindow) return

    const html = `
      <html>
        <head>
          <title>Impressão</title>
          <style>
            @page {
              size: 9cm 12cm;
              margin: 0;
            }
            body {
              margin: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
            }
            img {
              width: 9cm;
              height: 12cm;
              object-fit: cover;
            }
          </style>
        </head>
        <body>
          <img src="${dataUrl}" />
          <script>
            window.onload = function () {
              setTimeout(() => {
                window.print()
                window.close()
              }, 100)
            }
          </script>
        </body>
      </html>
    `

    printWindow.document.open()
    printWindow.document.write(html)
    printWindow.document.close()
  } catch (error) {
    console.error('Erro ao imprimir imagem:', error)
  }
}


  return (
    <div>
      <div className="fields">
        <label htmlFor="number">
          Nº:
          <input
            type="text"
            name="number"
            id="number"
            onChange={(e) => setNumber(e.target.value)}
            value={number}
          />
        </label>
        <label htmlFor="block">
          Bloco:
          <input
            type="text"
            name="block"
            id="block"
            onChange={(e) => setBlock(e.target.value)}
            value={block}
          />
        </label>
        <button onClick={handleDownload}>Baixar</button>
        <button onClick={handlePrintAsImage}>Imprimir</button>
      </div>

      <div className="new-parking-card" ref={cardRef}>
        <div className="boulevard-parking">
          <div className="boulevard-field">
            <h1>{number}</h1>
            <h1>{block}</h1>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
