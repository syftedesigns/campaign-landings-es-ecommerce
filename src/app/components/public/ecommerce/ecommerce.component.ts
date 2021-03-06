import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { SizeDevice } from 'src/app/classes/window.class';
import { DOCUMENT } from '@angular/platform-browser';
import { MatDialog } from '@angular/material';
import { CampaignService } from 'src/app/services/ads/campaign.service';
import { NgForm } from '@angular/forms';
import { EcommerceModalComponent } from '../shared/ecommerce-modal/ecommerce-modal.component';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DiscountObject } from 'src/app/classes/campaign/discount.model';

@Component({
  selector: 'app-ecommerce',
  templateUrl: './ecommerce.component.html',
  styleUrls: ['./ecommerce.component.css', '../../../../ads.css']
})
export class EcommerceComponent implements OnInit, OnDestroy {
  Device: SizeDevice;
  constructor(@Inject(DOCUMENT) private document: Document,
  public dialog: MatDialog, private _adService: CampaignService,
  private _getParam: ActivatedRoute, private _auth: AuthService) {
            // Al cargar la pagina verificamos si tiene algun parametro de descuento en nuestra campaña
            this._getParam.queryParams.subscribe(
              (GET) => {
                if (GET['from'] && ( GET['from'] !== undefined) && ( GET['from'] !== '')) {
                  if (GET['offer'] && (GET['offer'] !== undefined) && (GET['offer'] !== '')) {
                    // Si hay descuento de oferta entonces lo guardamos en el servicio
                    this._auth.DiscountBonus = new DiscountObject(GET['from'], GET['offer']);
                  }
                }
              }
            );
  }

  ngOnInit() {
    this.document.body.removeAttribute('class');
    this.document.body.classList.add('ads-theme-shop');
    this.Device = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    console.log(this.Device);
  }
  ngOnDestroy() {
    this.document.body.removeAttribute('class');
  }

  OpenTrial(email: string = ''): void {
    // Limpiamos el body
    this.document.body.removeAttribute('class');
    // Desaparecemos el menu de la pagina para que no se muestre en el modal
    this._adService.showMenuCampaign = false;
    const dialogRef = this.dialog.open(EcommerceModalComponent, {
      panelClass: ['dialog-resize-xl'],
      data: email,
      width: '100%',
      maxWidth: '100vw !important',
      minHeight: '100vh',
      autoFocus: false,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(
      () => {
        this.document.body.classList.add('ads-theme-shop');
        this._adService.showMenuCampaign = true;
      }
    );
  }
  PrecreatedEmail(valueOf: NgForm): void {
    if (valueOf.invalid) {
      throw new Error('Form invalid');
    }
    console.log(valueOf.value);
    // Mandamos el email y abrimos el popup
    this.OpenTrial(valueOf.value.email);
  }
}

