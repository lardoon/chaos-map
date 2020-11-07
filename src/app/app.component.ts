import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  VERSION,
  ViewChild
} from "@angular/core";

import { defineGrid, extendHex } from "honeycomb-grid";

import * as SVG from "@svgdotjs/svg.js/src/svg.js";

import * as map from "../hex.map.json";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements AfterViewInit {
  map: any;

  @ViewChild("container")
  container: ElementRef;

  ngAfterViewInit(): void {
    this.map = map;

    const draw = SVG.default()
      .addTo(this.container.nativeElement)
      .size("100%", "100%");

    const Hex = extendHex({ size: 40 });
    
    const Grid = defineGrid(Hex);
    // get the corners of a hex (they're the same for all hexes created with the same Hex factory)
    const corners = Hex().corners();
    // an SVG symbol can be reused
    const hexSymbol = draw
      .symbol()
      // map the corners' positions to a string and create a polygon
      .polygon(corners.map(({ x, y }) => [x, y]).join(" "))
      .fill("none")
      .stroke({ width: 2, color: "#999" });

    // render 10,000 hexes
    Grid.rectangle({ width: this.map.width, height: this.map.height }).forEach(
      hex => {
        const { x, y } = hex.toPoint();
        const coord = hex.x + hex.y * this.map.width;
        console.log(this.map.layers[0].tiles[coord]);
        if(this.map.layers[0].tiles[coord] != null) {
        // use hexSymbol and set its position for each hex
        draw
          .use(hexSymbol)
          .translate(x, y);
        }
      }
    );
  }
}
