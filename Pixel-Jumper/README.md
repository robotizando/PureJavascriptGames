# Pixel Jumper - Jogo de Plataforma

Um jogo de plataforma simples e divertido criado com JavaScript puro, HTML5 e CSS moderno. Desenvolvido para demonstrar conceitos fundamentais de programação web e desenvolvimento de jogos.

## 🎮 Sobre o Jogo

Pixel Jumper é um jogo de plataforma clássico onde você controla um personagem que deve coletar moedas, evitar inimigos e completar níveis progressivamente mais desafiadores.

### Características Principais

- **Movimento fluido**: Controles responsivos com física realista
- **Sistema de gravidade**: Implementação própria de física de pulo e queda
- **Coleta de itens**: Moedas espalhadas pelos níveis para coletar
- **Inimigos móveis**: Obstáculos que se movem em padrões definidos
- **Sistema de vidas**: Múltiplas tentativas para completar cada nível
- **Progressão de níveis**: Dificuldade crescente com mais desafios
- **Efeitos visuais**: Partículas, animações e feedback visual
- **Interface completa**: Telas de início, game over e pausa

## 🕹️ Como Jogar

### Controles
- **Movimento**: Use as setas ← → ou as teclas A e D
- **Pular**: Pressione ↑, W ou ESPAÇO
- **Pausar**: Pressione P durante o jogo

### Objetivo
1. Colete todas as moedas douradas do nível
2. Evite tocar nos inimigos vermelhos
3. Use as plataformas para navegar pelo cenário
4. Complete o nível coletando todas as moedas

### Sistema de Pontuação
- **Moedas**: 100 pontos cada
- **Bônus de tempo**: Pontos extras por completar rapidamente
- **Vida extra**: Ganhe uma vida adicional a cada nível completado

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica e acessível
- **CSS3**: Estilos modernos com gradientes, animações e efeitos
- **JavaScript ES6+**: Lógica do jogo com programação orientada a objetos
- **Canvas-free**: Implementação usando apenas DOM e CSS

## 📁 Estrutura do Projeto

```
pixel-jumper/
├── index.html          # Estrutura principal do jogo
├── style.css           # Estilos visuais e animações
├── script.js           # Lógica do jogo em JavaScript
└── README.md           # Documentação do projeto
```

## 🎯 Conceitos Demonstrados

### Programação Web
- Manipulação do DOM
- Event listeners para teclado
- Animações CSS e JavaScript
- Responsive design
- Estruturação de código modular

### Desenvolvimento de Jogos
- Game loop com requestAnimationFrame
- Sistema de física básico (gravidade, colisões)
- Gerenciamento de estado do jogo
- Detecção de colisões AABB
- Sistema de partículas simples
- Câmera que segue o jogador

### Técnicas CSS Avançadas
- Gradientes lineares e radiais
- Transformações e animações
- Pseudo-elementos para detalhes visuais
- Clip-path para formas customizadas
- Box-shadow para efeitos de brilho

## 🚀 Como Executar

1. Clone ou baixe os arquivos do projeto
2. Abra o arquivo `index.html` em um navegador moderno
3. Clique em "INICIAR JOGO" e divirta-se!

### Requisitos
- Navegador moderno com suporte a ES6+
- JavaScript habilitado
- Resolução mínima recomendada: 1024x768

## 🎨 Personalização

O jogo foi desenvolvido de forma modular, permitindo fácil customização:

### Ajustar Dificuldade
Modifique as variáveis em `gameSettings`:
```javascript
let gameSettings = {
    gravity: 0.6,        // Força da gravidade
    jumpPower: -12,      // Força do pulo
    playerSpeed: 4,      // Velocidade do jogador
    enemySpeed: 1.5,     // Velocidade dos inimigos
    maxFallSpeed: 12     // Velocidade máxima de queda
};
```

### Adicionar Novos Níveis
Modifique a função `createLevel()` para adicionar novas plataformas, moedas e inimigos.

### Personalizar Visual
Altere as cores e efeitos no arquivo `style.css` para criar sua própria identidade visual.

## 📚 Valor Educacional

Este projeto é ideal para:
- **Iniciantes em JavaScript**: Demonstra conceitos fundamentais de forma prática
- **Estudantes de programação web**: Mostra integração entre HTML, CSS e JavaScript
- **Workshops e palestras**: Exemplo completo e funcional para ensino
- **Desenvolvedores iniciantes em jogos**: Introdução aos conceitos básicos de game development

## 🔧 Possíveis Melhorias

- Sistema de som e música
- Mais tipos de inimigos e power-ups
- Níveis com design mais elaborado
- Sistema de ranking e pontuação online
- Suporte a controles de gamepad
- Modo multiplayer local

## 📄 Licença

Este projeto é de código aberto e pode ser usado livremente para fins educacionais e pessoais.

---

**Desenvolvido com ❤️ para demonstrar o poder do JavaScript puro no desenvolvimento de jogos web.**

