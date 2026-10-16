import Phaser from "phaser";
import { joinBattle } from "../network";

export class LobbyScene extends Phaser.Scene {
  constructor() {
    super("lobby");
  }

  create() {
    const { width, height } = this.scale;

    this.add
      .text(width / 2, height / 2 - 80, "CLASH CLONE", {
        fontFamily: "sans-serif",
        fontSize: "48px",
        color: "#ffd54a",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    const status = this.add
      .text(width / 2, height / 2 + 60, "", {
        fontFamily: "sans-serif",
        fontSize: "18px",
        color: "#cfd8e3",
      })
      .setOrigin(0.5);

    const button = this.add
      .text(width / 2, height / 2, "FIND MATCH", {
        fontFamily: "sans-serif",
        fontSize: "28px",
        color: "#ffffff",
        backgroundColor: "#2e7d32",
        padding: { x: 24, y: 12 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    button.on("pointerover", () => button.setStyle({ backgroundColor: "#388e3c" }));
    button.on("pointerout", () => button.setStyle({ backgroundColor: "#2e7d32" }));

    button.on("pointerdown", async () => {
      button.disableInteractive();
      status.setText("Connecting...");
      try {
        const room = await joinBattle();
        status.setText(`Joined room ${room.roomId}. Waiting for opponent...`);
        room.onStateChange.once(() => {
          this.scene.start("battle");
        });
      } catch (err) {
        console.error(err);
        status.setText("Failed to connect. Is the server running?");
        button.setInteractive({ useHandCursor: true });
      }
    });
  }
}
