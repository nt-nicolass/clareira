# Clareira: passo a passo para publicar o app e o site

Site: **https://nt-nicolass.github.io/clareira/**
App Android: o link **Baixar o app para Android** fica em Ajustes, dentro do site.

---

## Passo 1. Proteger seus dados no Firebase (2 min)

1. Abra **console.firebase.google.com** → projeto **clareira**.
2. Menu da esquerda: **Firestore Database** → aba **Regras**.
3. Apague tudo o que estiver lá e cole o conteúdo do arquivo **firestore.rules**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

4. Clique em **Publicar**.

Confira também em **Authentication → Método de login** se **E-mail/senha** está **Ativado**.

## Passo 2. Deixar o repositório público e ligar o site (1 min)

O GitHub Pages grátis só funciona em repositório público. Seu código fica visível, mas seus dados não: eles ficam no Firebase, protegidos pelo seu login.

1. Em **github.com/nt-nicolass/clareira** → **Settings**.
2. Se o repositório estiver privado: lá embaixo, em *Danger Zone* → **Change visibility** → **Public**.
3. Menu da esquerda: **Pages** → em *Build and deployment*, **Source** = **GitHub Actions**.

## Passo 3. Enviar os arquivos (3 min)

1. Descompacte o **clareira-projeto.zip** no computador.
2. No repositório, clique em **Add file → Upload files**.
3. Abra a pasta descompactada, selecione **tudo o que está dentro dela** (Ctrl+A) e arraste para a página do GitHub.
4. Espere a lista de arquivos carregar e clique em **Commit changes**.

**Confira se a pasta `.github` subiu.** Ela aparece na lista de arquivos do repositório. Se não aparecer:

1. **Add file → Create new file**.
2. No nome, digite exatamente: `.github/workflows/publicar.yml`
3. Cole o conteúdo do arquivo `.github/workflows/publicar.yml` da pasta descompactada (abra com o Bloco de Notas).
4. **Commit changes**.

## Passo 4. Esperar o GitHub montar tudo (uns 8 minutos)

1. Clique na aba **Actions** do repositório.
2. Vai aparecer **Publicar Clareira (site + app Android)** rodando (bolinha amarela).
3. Quando ficar com o **✓ verde**, o site e o app estão prontos.
4. Se ficar **✗ vermelho**: clique nele, depois na etapa com erro, copie as últimas linhas e mande para o Claude.

## Passo 5. Usar no computador

1. Abra **https://nt-nicolass.github.io/clareira/** no Chrome ou no Edge.
2. Na primeira tela, toque em **Já uso o Clareira: entrar na minha conta** → **Criar conta** com seu e-mail e uma senha.
3. Instale como app: menu **⋮ → Transmitir, salvar e compartilhar → Instalar página como app** (no Edge: **⋯ → Aplicativos → Instalar este site como aplicativo**).

## Passo 6. Instalar no celular (Android)

1. No celular, abra **https://nt-nicolass.github.io/clareira/** no Chrome.
2. Vá em **Ajustes** (engrenagem) → **Baixar o app para Android**.
3. Abra o arquivo baixado (**Clareira.apk**). O Android vai pedir para **permitir instalar apps desta fonte**: permita e toque em **Instalar**. O aviso do Play Protect é normal, porque o app não vem da Play Store: toque em *Instalar mesmo assim*.
4. Abra o Clareira → **Já uso o Clareira: entrar na minha conta** → **Entrar** com o mesmo e-mail e senha.
5. Permita as **notificações** quando ele pedir.
6. Em **Alarmes**, toque em **Permitir alarmes no horário exato**.
7. **No Samsung:** Configurações → Aplicativos → Clareira → Bateria → **Sem restrições**.

## Passo 7. Trazer seus dados atuais

1. Na versão antiga (o Clareira no claude.ai): **Ajustes → Exportar backup** → copie o texto que aparece.
2. No novo, no computador: **Ajustes → Restaurar backup** → cole → **Restaurar agora**.
3. Em segundos, os dados aparecem também no celular.

---

## Como funciona

- **Sem internet:** tudo continua funcionando e fica salvo no aparelho. Quando a internet volta, sobe sozinho para a nuvem e aparece no outro aparelho.
- **Alarmes no celular:** viram avisos do Android que tocam mesmo com o app fechado. O Clareira agenda os próximos 9 dias e renova toda vez que você abre o app. Para acordar em dias muito importantes, use também o despertador do celular.
- **Alarmes no computador:** só tocam com a página aberta.
- **Secretária com IA:** continua só na versão do claude.ai.
- **Atualizar o app:** quando mudar algo e enviar ao GitHub, o site atualiza sozinho. No celular, baixe o APK de novo em Ajustes e instale por cima: seus dados continuam.
