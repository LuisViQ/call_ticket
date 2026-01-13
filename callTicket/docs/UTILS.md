# Utilitarios

src/utils/utils.ts
-> storeJwtToken(token)
-> Salva token no AsyncStorage na chave jwtToken.
-> getJwtToken()
-> Le jwtToken do AsyncStorage.
-> removeJwtToken()
-> Remove jwtToken e registra a conclusao.
-> storeUserData(loginResponse)
-> Salva objeto do usuario como JSON na chave userData.
-> getUserData()
-> Le e faz parse do JSON de userData.
