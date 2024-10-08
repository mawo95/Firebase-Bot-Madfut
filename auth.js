const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, OAuthProvider, signInWithCredential, GoogleAuthProvider } = require('firebase/auth');
const axios = require('axios');

class Auth {
  constructor(app) {
    this.auth = getAuth(app);
  }
    
  async signOut(){
      await this.auth.signOut()
      return true//.then(() =>{
      }
      
 async createAcc(email,password){
     await createUserWithEmailAndPassword(this.auth,email,password)
 }

  async signInOldLol(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.log(error)
     
    }
  }

    
    async login() {
        const clientId = '660557070780-5h8jeccpts8k5ggsc3c5rlreurlab4h5.apps.googleusercontent.com';
const clientSecret = '';
const refreshToken = "1//..."

const url = 'https://oauth2.googleapis.com/token';
const data = {
  client_id: clientId,
  client_secret: clientSecret,
  grant_type: 'refresh_token',
  refresh_token: refreshToken,
};

const resHaha = await axios.post(url, null, {
  params: data,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
})

	const responseData = resHaha.data;
        const idTokenNew = responseData.id_token
        const accessTokenNew = responseData.access_token
        const credentials = new GoogleAuthProvider.credential(idTokenNew,accessTokenNew)
        const user = await signInWithCredential(this.auth, credentials)
        return user.user
	}

    
  
    
}

module.exports = Auth;
