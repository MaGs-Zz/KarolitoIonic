import { Component } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { MyPhoto } from './photo.interface';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  photos: MyPhoto[] = [];
  imageUrl: string = '';

  constructor(private alertController: AlertController) {}

  async ngOnInit() {
    this.loadPhotos();
  }

  async presentCaptionPrompt(): Promise<string> {
  const alert = await this.alertController.create({
    header: '🖼️ Nombre de la foto', // Emoji opcional para estilo
    cssClass: 'custom-caption-alert', // Clase para estilos
    inputs: [
      {
        name: 'caption',
        type: 'text',
        placeholder: 'Escribe un nombre',
        cssClass: 'custom-input', // Clase para el input
      }
    ],
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel',
        cssClass: 'custom-btn-cancel'
      },
      {
        text: 'Guardar',
        role: 'confirm',
        cssClass: 'custom-btn-confirm'
      }
    ]
  });

  await alert.present();

  const result = await alert.onDidDismiss();
  return result.role === 'confirm' ? result.data.values.caption : '';
}


  takePicture = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri,
    });

    const caption = await this.presentCaptionPrompt();

    const photo: MyPhoto = {
      id: new Date().getTime().toString(),
      webPath: image.webPath || '',
      caption: caption || 'Sin nombre',
      liked: false, // ⬅ NUEVO
    };

    this.photos.push(photo);
    this.savePhotos();
  };

  savePhotos() {
    localStorage.setItem('photos', JSON.stringify(this.photos));
  }

  loadPhotos() {
    const data = localStorage.getItem('photos');
    if (data) {
      this.photos = JSON.parse(data);
    }
  }

  deletePhoto(id: string) {
    this.photos = this.photos.filter(photo => photo.id !== id);
    this.savePhotos();
  }

  toggleLike(photo: MyPhoto) {
    photo.liked = !photo.liked;
    this.savePhotos();
  }

}
