import { Component, OnInit } from '@angular/core';
import { Subscription } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { CarService } from "../shared/car/car.service";
import { GiphyService } from "../shared/giphy/giphy.service";
import { NgForm } from "@angular/forms";

@Component({
  selector: 'app-car-edit',
  templateUrl: './car-edit.component.html',
  styleUrls: ['./car-edit.component.sass']
})
export class CarEditComponent implements OnInit {
  car: any = {};
  sub: Subscription;

  constructor(private route: ActivatedRoute, private router: Router, private carService: CarService, private giphyService: GiphyService) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.carService.get(id).subscribe((car: any) => {
          if (car) {
            this.car = car;
            this.car.href = car._links.self.href;
            this.giphyService.get(car.name).subscribe(url => car.giphyUrl = url);
          } else {
            console.log(`Car with id ${id} not found, returning to list.`)
            this.gotoList();
          }
        })
      }
    })
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  gotoList() {
    this.router.navigate(['/car-list']).then(res => {
      console.log(res)
    })
  }

  save(form: NgForm) {
    this.carService.save(form).subscribe(result => {
      this.gotoList();
    }, err => console.error(err));
  }

  remove(href) {
    this.carService.remove(href).subscribe(result => {
      this.gotoList();
    }, err => console.error(err));
  }
}