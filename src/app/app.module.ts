import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Camera } from '@ionic-native/camera';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { MediaCapture } from '@ionic-native/media-capture';
import { ImagePicker } from '@ionic-native/image-picker';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { VideoEditor } from '@ionic-native/video-editor';
import { HttpClientModule } from '@angular/common/http';
@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule, HttpClientModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera, MediaCapture, ImagePicker, AndroidPermissions, VideoEditor,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
