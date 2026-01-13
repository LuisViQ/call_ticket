# Arquivos da Raiz e Assets

App.tsx
-> Componente de entrada que envolve o app com SafeAreaProvider e AuthProvider.
-> Renderiza Routes para que a navegacao fique disponivel apos os providers.

index.ts
-> Arquivo de entrada do Expo que registra App com registerRootComponent.
-> Garante a configuracao correta para Expo Go e builds nativas.

app.json
-> Configuracao do Expo: nome, slug, versao, icones, splash, e configuracoes de plataforma.
-> Configuracoes do Android incluem edge-to-edge e toggle do gesto de voltar preditivo.

package.json
-> Define scripts para start do Expo e alvos de plataforma.
-> Declara dependencias para navegacao, storage, image picker, e runtime do Expo.

package-lock.json
-> Lockfile do NPM para installs deterministicas.

tsconfig.json
-> Estende expo/tsconfig.base e habilita strict type checking.

README.md
-> Visao geral do app, passos de setup, e fluxos principais.

assets/
-> assets/icon.png: icone do app usado pelo Expo.
-> assets/adaptive-icon.png: icone adaptativo do Android.
-> assets/splash-icon.png: imagem de splash.
-> assets/favicon.png: favicon web.
-> assets/alarmclock-light.svg: SVG estatico (nao referenciado no codigo).

public/
-> public/images/phone-light.svg: asset estatico web.
-> public/images/setting-vert.svg: asset estatico web.

.env
-> Esperado conter EXPO_PUBLIC_BASE_URL para acesso a API.
