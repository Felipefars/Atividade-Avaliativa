const canvas = document.getElementById('jogoCanvas')
const ctx = canvas.getContext('2d')

const teclasPressionadas = {
   KeyW: false,
   KeyS: false,
   KeyD: false,
   KeyA: false
};
document.addEventListener('keydown', (e) => {
   for (let tecla in teclasPressionadas) {
       if (teclasPressionadas.hasOwnProperty(e.code)) {
           teclasPressionadas[tecla] = false;
       }
   }
   if (teclasPressionadas.hasOwnProperty(e.code)) {
       teclasPressionadas[e.code] = true;
   }
});

class Entidade {
   constructor(x, y, largura, altura) {
       this.x = x
       this.y = y
       this.largura = largura
       this.altura = altura
   }
   desenhar(cor) {
       ctx.fillStyle = cor
       ctx.fillRect(this.x, this.y, this.largura, this.altura)
   }
}

class Cobra extends Entidade {
   constructor(x, y, largura, altura) {
       super(x, y, largura, altura)
       this.corpo = [{x: x, y: y}]
   }
   atualizar() {
       let cabeca = {x: this.x, y: this.y}
       if (teclasPressionadas.KeyW) {
           cabeca.y -= 7
       } else if (teclasPressionadas.KeyS) {
           cabeca.y += 7
       } else if (teclasPressionadas.KeyA) {
           cabeca.x -= 7
       } else if (teclasPressionadas.KeyD) {
           cabeca.x += 7
       }
       this.x = cabeca.x
       this.y = cabeca.y
       this.corpo.unshift(cabeca)
       if (this.corpo.length > 1) {
           this.corpo.pop()
       }
   }
   verificarColisao(comida) {
       if (
           this.x < comida.x + comida.largura &&
           this.x + this.largura > comida.x &&
           this.y < comida.y + comida.altura &&
           this.y + this.altura > comida.y
       ) { 
           this.#houveColisao(comida)
       }
   }
   #houveColisao(comida) {
       comida.x = Math.random() * canvas.width - 10
       comida.y = Math.random() * canvas.height - 10
       this.corpo.push({x: this.x, y: this.y})
   }
   desenhar() {
       this.corpo.forEach((segmento, index) => {
           let cor = index === 0 ? 'green' : 'blue'
           new Entidade(segmento.x, segmento.y, 20, 20).desenhar(cor)
       })
   }
}

class Comida extends Entidade {
   constructor() {
       super(Math.random() * canvas.width - 10, Math.random() * canvas.height - 10, 20, 20)
   }
}

const cobra = new Cobra(100, 200, 20, 20)
const comida = new Comida()

function loop() {
   ctx.clearRect(0, 0, canvas.width, canvas.height)
   cobra.desenhar()
   cobra.atualizar()
   comida.desenhar('red')
   cobra.verificarColisao(comida)
   if (cobra.x < 0 || cobra.x >= canvas.width || cobra.y < 0 || cobra.y >= canvas.height) {
       alert("Game Over")
   }
   requestAnimationFrame(loop)
}
loop()
