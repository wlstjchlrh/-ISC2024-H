// supabaseManager.js

class SupabaseManager {
    constructor() {
      this.supabaseUrl = 'https://nvcfpowxsmqstvowphzc.supabase.co';
      this.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52Y2Zwb3d4c21xc3R2b3dwaHpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTcwNzI4MDYsImV4cCI6MjAzMjY0ODgwNn0.bPdquwDiDaYcVRt14iZLzWPEXWskEbeTz0ZBC-0XJvA';
      this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
      this.loadedImages = [];
      this.imageArray = JSON.parse(localStorage.getItem('imageArray')) || Array(4).fill(null);
      this.posts = [];
    }
  
    async uploadImageToSupabase(imageData, uniqueFileName) {
      const imageFile = this.dataURLtoFile(imageData, uniqueFileName);
  
      const { data, error } = await this.supabase.storage
        .from("test01")
        .upload(uniqueFileName, imageFile, {
          contentType: "image/jpg",
          cacheControl: "3600",
          upsert: false,
        });
  
      if (error) {
        console.error("Error uploading image:", error);
      } else {
        console.log("Image uploaded successfully:", data);
      }
    }
  
    async loadImagesFromSupabase() {
      const imageNames = this.imageArray;
      for (let i = 0; i < imageNames.length; i++) {
        const imageName = imageNames[i];
        if (imageName) {
          console.log("Downloading image with filename:", imageName);
          const { data, error } = await this.supabase.storage
            .from("test01")
            .download(imageName);
  
          if (error) {
            console.error("Error downloading image:", error);
          } else {
            console.log("Image downloaded successfully:", data);
            const imgURL = URL.createObjectURL(data);
            const img = loadImage(imgURL, () => {
              this.loadedImages[i] = img;
            });
          }
        }
      }
    }
  
    updateImageArray(image) {
      if (this.imageArray.length >= 8) {
        this.imageArray.shift();
      }
      this.imageArray.push(image);
      localStorage.setItem('imageArray', JSON.stringify(this.imageArray));
      console.log("Updated imageArray:", this.imageArray);
    }
  
    dataURLtoFile(dataurl, fileName) {
      var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
  
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
  
      return new File([u8arr], fileName, { type: mime });
    }
  
    async uploadPost(userInput) {
      const { error } = await this.supabase
        .from('post')
        .insert({ content: userInput, created_at: new Date().toISOString() });
  
      if (error) {
        console.error("Error uploading post:", error);
      } else {
        console.log("Post uploaded successfully:");
        const { data, fetchError } = await this.supabase
          .from('post')
          .select('content')
          .order('created_at', { ascending: true });
  
        if (fetchError) {
          console.error("Error fetching posts:", fetchError);
        } else {
          this.posts = data.map(item => item.content);
          console.log(this.posts);
        }
      }
    }
  }