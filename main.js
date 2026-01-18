import Phaser from 'phaser'
//Starting Screen & Cover
class SecondPreGameScene extends Phaser.Scene {
  constructor() {
    super("scene-second");
  }

  preload() {
    this.load.image("startBg", "/background.jpg");
    this.load.image("logo", "/LOGO.png");
  }

  create() {
    //Background
    this.add.image(sizes.width / 2, sizes.height / 2, "startBg").setScale(0.5);
    //Logo
    this.add.image(sizes.width / 2, sizes.height / 2 - 400, "logo").setScale(0.5);
    const centerX = sizes.width / 2;
    const centerY = sizes.height / 2;
    // BUTTON setup
    this.buttonWidth = 200;
    this.buttonHeight = 100;
    this.buttonRadius = 20;
    this.buttonX = centerX;
    this.buttonY = centerY;
  
    // Background graphics
    this.buttonBg = this.add.graphics();
  
    // Text on top of button
    this.startButton = this.add.text(this.buttonX, this.buttonY, "Start Simulation", {
      fontFamily: 'Megrim', // font name (important)
      fontSize: "48px",
      strokeThickness: 0,
      padding: { x: 20, y: 10 }
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true })
    .on("pointerover", () => this.enterButtonHoverState())
    .on("pointerout", () => this.enterButtonRestState())
    .on("pointerdown", () => this.enterButtonActiveState())
    .on("pointerup", () => {
      this.scene.start("scene-second-game");
    });
  
    this.enterButtonRestState();
  }

  //Starting Buttons animations
  drawButtonBg(colorHex) {
    this.buttonBg.clear();
    this.buttonBg.fillStyle(colorHex, 1);
    this.buttonBg.fillRoundedRect(
      this.buttonX - this.buttonWidth / 2,
      this.buttonY - this.buttonHeight / 2,
      this.buttonWidth,
      this.buttonHeight,
      this.buttonRadius
    );
    this.buttonBg.setDepth(0);
  }
  
  enterButtonHoverState() {
    this.startButton.setStyle({ fill: "#ED0086" }); // white : innen farbe hover Startbutton
    this.startButton.setScale(1.05);
  }
  
  enterButtonRestState() {
    this.startButton.setStyle({ fill: "#FFFFFF" }); // ruby : innen farbe hover Startbutton
    this.startButton.setScale(1);
  }
  
  enterButtonActiveState() {
    this.startButton.setScale(0.97);
  }
}  
// Simulator Screen
class SecondGameScene extends Phaser.Scene {
  constructor() {
    super("scene-second-game")

  }

  preload() {
    console.log("Preloading assets...");

    //Background Image
    this.load.image("background", "./background.jpg");
    //Purse Image
    this.load.image("purse", "./Purse.png");
    //Coins yay
    this.load.image("coin10", "./Coin10.png");
    this.load.image("coin20", "./Coin20.png");
    this.load.image("coin50", "./Coin50.png");
    //Machine Image
    this.load.image("machine", "./Machine.png");
    //CancelButton 
    this.load.image("cancelbutton", "/CancelButton.png");
    //Coin Slit
    this.load.image("slit", "/CoinSlit.png");
    //Alle Knöpfe vom Dial Board
    for (let i = 0; i <= 9; i++) {
      this.load.image(`zahl${i}`, `/Zahl${i}.png`);
    }
    //Alle Kuchen
    for (let j = 10; j <= 22; j++) {
      this.load.image(`cake${j}`, `/Cake${j}.png`);
    }

    //Alle Sounds
    this.load.audio('coinInsert', 'audio/coininsert.mp3');
    this.load.audio('coinsFall', 'audio/coinsfalling.mp3');
    this.load.audio('cakePop', 'audio/cake.mp3');
    this.load.audio('purseCoin', 'audio/pursecoin.mp3');
    this.load.audio('dial', 'audio/dial.mp3');
    this.load.audio('X', 'audio/X.mp3');

  }
  
  create() {
    console.log("Creating the scene...");
  
    // Background Image
    let bg = this.add.image(0, 0, "background").setOrigin(0, 0);
    let scaleX = sizes.width / bg.width;
    let scaleY = sizes.height / bg.height;
    // Machine Image
    let machi = this.add.image(45, 80, "machine").setOrigin(0, 0).setScale(0.5)
      .setOrigin(0, 0)
      .setScale(0.45)
      .setInteractive();
    // Use max so the image covers the whole canvas
    let scale = Math.max(scaleX, scaleY);
    bg.setScale(scale);

    //Score Digital Screen
    let score = 0;
    let scoreText = this.add.text(1150, 195, "0.00", {
      fontSize: "48px",
      color: "#ED0086"
    });

    // Purse Image
    let purse = this.add.image(1500, 800, "purse").setOrigin(0, 0).setScale(0.5)
      .setOrigin(0, 0)
      .setScale(0.5)
      .setInteractive();

    //Cancel Button
    let cancel = this.add.image(1080, 920, "cancelbutton").setOrigin(0, 0).setScale(0.5)
    .setOrigin(0, 0)
    .setScale(0.5)
    .setInteractive();

    // CoinSlit Image
    let coinslit = this.add.image(1060, 630, "slit").setOrigin(0, 0).setScale(0.5)
      .setOrigin(0, 0)
      .setScale(0.5)
      .setInteractive();

    //alle Kuchen Festpreise
    const cakePrices = {
        10: 0.20, // <--Cake10 kostet 0.20
        11: 0.80, // Cake11 ..
        12: 1.20,
        13: 0.40,
        14: 1.50,
        15: 1.00,
        16: 0.50,
        17: 1.00,
        18: 0.20,
        19: 1.50,
        20: 0.40,
        21: 0.70
      };
      // Für Dial limitation def
      const validMin = 10;
      const validMax = 21;

      
    // Dial Buttons Positions x,y
    const positions = {
      1: { x: 1100, y: 300 },
      2: { x: 1190, y: 300 }, //Mittige Zahlen
      3: { x: 1280, y: 300 },
    
      4: { x: 1100, y: 390 },
      5: { x: 1190, y: 390 }, //Mittige Zahlen
      6: { x: 1280, y: 390 },
    
      7: { x: 1100, y: 480 },
      8: { x: 1190, y: 480 }, //Mittige Zahlen
      9: { x: 1280, y: 480 },
    
      0: { x: 1190, y: 570 } //Mittige Zahlen
      };
      
      let dial = "";

      let dialText = this.add.text(1100, 195, dial, {
        fontSize: "48px",
        color: "#ED0086"

      });

      for (let i = 0; i <= 9; i++) {
        const pos = positions[i];

        let numberButton = this.add.image(pos.x, pos.y, `zahl${i}`)
          .setScale(0.5)
          .setInteractive();

      numberButton.on("pointerdown", () => {
        this.sound.play('dial');
        //remove only when dialing begins
        if (scoreText) {
          scoreText.setVisible(false);
        }

        // dial and dial length max
        if (dial.length < 2) {
          dial += i;
          dialText.setText(dial);
          dialText.setVisible(true);
        }

        if (dial.length === 2) {

          const cakeIndex = parseInt(dial, 10);
          
          // invalid if out of range OR not in price map
          if (cakeIndex < validMin || cakeIndex > validMax || !cakePrices.hasOwnProperty(cakeIndex)) {
      
            // Play X error sound
            this.sound.play('X');
            // hide dial so X is visible
            dialText.setVisible(false);
        
            scoreText.setVisible(true);
            scoreText.setText("X");

            this.time.delayedCall(1000, () => {
              scoreText.setText(score.toFixed(2));
            });
          }
          // valid → buy
          const code = dial;
          
          dial = "";
          dialText.setText("");
          dialText.setVisible(false);
        
          tryBuyCake.call(this, code);
        }
        
      });
      }

    // List of coin keys
    const coinTypes = ["coin10", "coin20", "coin50"];
    let currentCoin = null; // holds the coin being dragged
    let coins = []; // all coins stored we create DONT forget to remove the ones we use to buy with

    // Enable dragging on purse so dragstart fires
    purse.on("pointerdown", (pointer) => {
      const randomKey = Phaser.Utils.Array.GetRandom(coinTypes);
      currentCoin = this.add.image(pointer.x, pointer.y, randomKey)
        .setScale(0.5)
        .setInteractive();
      // Make this new coin draggable
      this.input.setDraggable(currentCoin);
      this.sound.play('purseCoin');

      //save our coins so we can get them back after cancelin
      coins.push(currentCoin);
    });

    // Drag handler for ANY draggable object
    this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });

    this.input.on("dragend", (pointer, gameObject) => {

      // Check if the coin overlaps the slit
      if (Phaser.Geom.Intersects.RectangleToRectangle(
          gameObject.getBounds(),
          coinslit.getBounds()
      )) {
          // Set coin invisible after putting it in slit
          gameObject.setVisible(false);
          gameObject.disableInteractive();
          
    
          // Add to score depending on coin type
          if (gameObject.texture.key === "coin10") score += 0.10;
          if (gameObject.texture.key === "coin20") score += 0.20;
          if (gameObject.texture.key === "coin50") score += 0.50;

          //Sound coin
          this.sound.play('coinInsert', { volume: 1, loop: false }); this.time.delayedCall(1000, () => this.sound.stopByKey('coinInsert'));


          // Update score display
          scoreText.setVisible(true);
          scoreText.setText(score.toFixed(2));

      }
    });

    cancel.on("pointerdown", () => {
      // Remove old coins
      coins.forEach(c => c.destroy());
      coins = [];
  
      // Refund coins based on current score
      let remaining = score;
  
      // Give back 50¢ coins first
      while (remaining >= 0.5) {
          remaining -= 0.5;
          let coin = this.add.image(purse.x, purse.y, "coin50").setScale(0.5).setInteractive();
          this.input.setDraggable(coin);
          coins.push(coin);
          this.sound.play('coinsFall');
      }
  
      // Give back 20¢ coins
      while (remaining >= 0.2) {
          remaining -= 0.2;
          let coin = this.add.image(purse.x, purse.y, "coin20").setScale(0.5).setInteractive();
          this.input.setDraggable(coin);
          coins.push(coin);
          this.sound.play('coinsFall');
      }
  
      // Give back 10¢ coins
      while (remaining >= 0.1) {
          remaining -= 0.1;
          let coin = this.add.image(purse.x, purse.y, "coin10").setScale(0.5).setInteractive();
          this.input.setDraggable(coin);
          coins.push(coin);
          this.sound.play('coinsFall');
      }
  
      // Reset score
      score = 0;
      scoreText.setText(score.toFixed(2));
  
      // Reset dial
      dial = "";
      dialText.setText("");
  });
  

function tryBuyCake(dial) {
  const cakeIndex = parseInt(dial);

  // check if cake exists in price list
  if (!cakePrices.hasOwnProperty(cakeIndex)) return;

  const price = cakePrices[cakeIndex];

  if (score >= price) {
    score -= price;
    scoreText.setVisible(true)
    scoreText.setText(score.toFixed(2));


  // Show cake output and make it draggable
  let cake = this.add.image(1600, 300, `cake${cakeIndex}`)
    .setScale(0.6)
    .setInteractive();

  this.input.setDraggable(cake);

  this.sound.play('cakePop');

  } else {
    // Not enough money
    this.sound.play('X');
    scoreText.setVisible(true);
    scoreText.setText("X");

    // reset after 1 second
    this.time.delayedCall(1000, () => {
      scoreText.setText(score.toFixed(2));
    });
  }
}
  }
      
  //Buttons dynamic allgemein
  drawButtonBg(colorHex) {
    this.buttonBg.clear();
    this.buttonBg.fillStyle(colorHex, 1);
    this.buttonBg.fillRoundedRect(
      this.buttonX - this.buttonWidth / 2,
      this.buttonY - this.buttonHeight / 2,
      this.buttonWidth,
      this.buttonHeight,
      this.buttonRadius
    );
    this.buttonBg.setDepth(0);
  }
      
  enterButtonHoverState() {
    this.drawButtonBg(0x222222);
    this.retryButton.setStyle({ fill: "#ffff00" }); // yellöw
    this.retryButton.setScale(1.05);
  }
    
  enterButtonRestState() {
    this.drawButtonBg(0x000000);
    this.retryButton.setStyle({ fill: "#06ff06" }); // green
    this.retryButton.setScale(1);
  }
    
  enterButtonActiveState() {
    this.drawButtonBg(0x003333);
    this.retryButton.setStyle({ fill: "#00ffff" }); // cyan
    this.retryButton.setScale(0.97);
  }
}



//Window Size Game 978x550 small screen better for mobile
//big screen 1955x1096 for desktop
const sizes = {
  width: 1955,
  height: 1096
};
//Physics Speed
const speedRight = 50;

//attributes of the game itself, (gravity, .. )
const config = {
  type: Phaser.WEBGL,
  width: sizes.width,
  height: sizes.height,
  canvas: document.getElementById("gameCanvas"),
  physics:{
    default:"arcade",
    arcade:{
      debug: false
    }
  },
  scene:[
    SecondPreGameScene, SecondGameScene] 
};

console.log("Game config created with scenes:", config.scene.map(s => s.name || s.constructor.name));
const game = new Phaser.Game(config);

// Add error handling for scene transitions
game.events.on('ready', () => {
  console.log("Game is ready");
});

// Log scene changes for debugging
if (game.scene) {
  const originalStart = game.scene.start;
  game.scene.start = function(key, data) {
    console.log("Scene transition: Starting scene", key, "with data:", data);
    return originalStart.call(this, key, data);
  };
}
