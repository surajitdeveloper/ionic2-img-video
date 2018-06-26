import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions } from '@ionic-native/media-capture';
import { ImagePicker } from '@ionic-native/image-picker';
import { VideoEditor } from '@ionic-native/video-editor';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { HttpClient, HttpHeaders } from '@angular/common/http';
//import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
//import { File } from '@ionic-native/file';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  cap_img: string = "";
  images = [];
  files = [];
  video: string = "";
  //video_url: any;
  previewFile(inputObj) {
    //console.log(inputObj);
    let fileObj = inputObj.files[0];
    console.log(fileObj.size);
    let webworkerReader = new FileReader();
    /*webworkerReader.onload = function(fileLoadedEvent){
      let file_size = fileObj.size;
      this.video_url = fileLoadedEvent.target;
      console.log(result.result);
    };*/   
    webworkerReader.onload = (fileLoadedEvent: FileReaderEvent)=>
    {
      let video_url = fileLoadedEvent.target;
      console.log(video_url);
      console.log("27");
      this.files.push(video_url.result);
      //console.log(video_url.result);
      //console.log("29");
      //this.video = fileLoadedEvent.target.result;
      //let v = JSON.parse(JSON.stringify(video_url));
      //console.log(v);
    }
    webworkerReader.readAsDataURL(fileObj);
  }
  constructor(public navCtrl: NavController,
    private mediaCapture: MediaCapture,
    private camera: Camera,
    private imagePicker: ImagePicker,
    private videoEditor: VideoEditor,
    private androidPermissions: AndroidPermissions,
    private http: HttpClient
    //private transfer: FileTransfer, private file: File
  ) {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(
      result => console.log('Has permission?',result.hasPermission),
      err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
    );


    //const fileTransfer: FileTransferObject = this.transfer.create();
   }
  imgFunction(imgUri)
  {
    let img = new Image();
    img.src = imgUri;

    img.onload = function () {
      var imgSize = {
        w: img.width,
        h: img.height
      };
      console.log(imgSize.w + ' ' + imgSize.h);
    };
  }
  send()
  {
    //'Authorization': 'my-auth-token'
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    this.http.post("http://surajitdeveloper.in/projects/post_example/",{files:this.files},httpOptions)
    .subscribe(
      data=>{
        let return_data = JSON.parse(JSON.stringify(data));
        if(return_data.status == "success")
        {
          if(typeof return_data.files != "undefined" && return_data.files > 0)
          {
            alert("Upload Completed !!! You upload - "+return_data.files+" files");
          }
          else
          {
            alert("upload completed but no files");
          }
        }
        else
        {
          alert("service failed");
        }
      },
      error=>{
        console.log("failed");
        console.log(error);
      }
    )
  }
  openCamera(type)
  {
    if (type == "media")
    {
      this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE);
      let options: CaptureImageOptions = { limit: 3 };
      this.mediaCapture.captureImage(options)
        .then(
        (data: MediaFile[]) => { console.log(data) },
        (err: CaptureError) => console.error(err)
        );
    }
    else if (type == "camera")
    {
      const options: CameraOptions = {
        quality: 100,
        allowEdit: true,
        targetWidth: 100,
        targetHeight: 100,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        sourceType: this.camera.PictureSourceType.CAMERA 
      }

      this.camera.getPicture(options).then((imageData) => {
        let base64Image = 'data:image/jpeg;base64,' + imageData;
        this.cap_img = base64Image;
        this.imgFunction(base64Image);
      }, (err) => {
        console.error(err)
      });
    }
    else if (type == "pickercamera")
    {
      let options = {
        maximumImagesCount: 3,
        width: 800,
        height: 800,
        quality: 75,
        outputType: 1
      }
      this.imagePicker.getPictures(options).then((results) => {
        for (var i = 0; i < results.length; i++) {
          let base64Image = 'data:image/jpeg;base64,' + results[i];
          this.images.push(base64Image);
          this.files.push(base64Image);
          this.imgFunction(base64Image);
        }
      }, (err) => { });
    }
    else if(type == "video")
    {
      const options: CameraOptions = {
        destinationType: this.camera.DestinationType.FILE_URI,
        mediaType: this.camera.MediaType.VIDEO,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
      }

      this.camera.getPicture(options).then((imageURI) => {
        let imageData = "file://"+imageURI;
        //console.log(imageURI);
        //let imageData = "file:///storage/emulated/0/DCIM/Camera/VID_20180403_190341.mp4";
        console.log(imageData);
        let file_name = "output"+new Date().getTime();

        this.videoEditor.transcodeVideo({
          fileUri: imageData,
          outputFileName: file_name,
        })
        .then((fileUri: string) => 
        {
          console.log('video transcode success', fileUri)
        })
        .catch((error: any) => console.log('video transcode error', error));
      }, (err) => {
        console.error(err)
      });
    }
  }

}
interface FileReaderEventTarget extends EventTarget {
  result:string
}

interface FileReaderEvent extends Event {
  target: FileReaderEventTarget;
  getMessage():string;
}