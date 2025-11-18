#include <iostream>
#include <string>
using namespace std;
string r,e,j1,j2,bb;
char w,x;
int p,s,a,k=0,n,i,j;
char m[3][3]={{'1','2','3'},{'4','5','6'},{'7','8','9'}};
void affichage ( ){
  cout<<"   -------------"<<endl;
  cout<<"   | "<<m[0][0]<<" | "<<m[0][1]<<" | "<<m[0][2]<<" |"<<endl;
  cout<<"   -------------"<<endl;
  cout<<"   | "<<m[1][0]<<" | "<<m[1][1]<<" | "<<m[1][2]<<" |"<<endl;
  cout<<"   -------------"<<endl;
  cout<<"   | "<<m[2][0]<<" | "<<m[2][1]<<" | "<<m[2][2]<<" |"<<endl;
  cout<<"   -------------"<<endl;
   }
void joueur ( ){
    cout<<"donner le nom de premier joueur :   ";
    cin>>j1;
    cout<<"donner le nom de deuxieme joueur :   ";
    cin>>j2;
    cout<<"      Qui va jouer en premier  X ou O : "<<endl;
   cout<<"      ";
   cin>>w;
  if(w!='o' && w!='x' && w!='X' && w!='O'){
    while (w!='o' && w!='x' && w!='O' && w!='X' ){
     cout<<"      erreur"<<endl;
     cout<<"    les joueurs est X ou O"<<endl;
     cout<<"       Qui va jouer en premier : "<<endl;
     cout<<"      ";
     cin>>w;
    }
    }
    if (p==0 && k==0){
      bb=j1;
     }
}
void rejouer( ){
  cout<<"vouler-vous rejouer le jeu ? 'oui' ou 'non' "<<endl;
  cin>>r;
  if(r!="oui" && r!="non"){
    while (r!="oui" && r!="non"){
     cout<<"Erreur "<<endl;
     cout<<"entrer 'oui' ou 'non' "<<endl;
     cout<<"vouler-vous rejouer le jeu ? 'oui' ou 'non' : "<<endl;
     cin>>r;
    }
  }
  if(r=="oui"){
    p=0;
    s=0;
    k=0;
    m[0][0]='1';
    m[0][1]='2';
    m[0][2]='3';
    m[1][0]='4';
    m[1][1]='5';
    m[1][2]='6';
    m[2][0]='7';
    m[2][1]='8';
    m[2][2]='9';
  }
  else {
    p=10;
  }
}
void out (){
    if (a>9 || a<1){
     while (a>9 || a<1){
    cout<<"Erreur"<<endl;
    cout<<"ce case n'existe pas entrer un nombre entre '1' et '9' "<<endl;
    cout<<"    "<<bb<<"    entrer le numero de case : "<<endl;
    cin>>a;
     }
    }
}
void erreur ( ){
 while ((a==n)&&(m[i][j]!=x)){
   cout<<"ce case est deja reservee "<<endl;
   cout<<"  "<<bb<<"   entrer un numero de case : "<<endl;
   cin>>a;
   out ();
 }
}
void input ( ){
  while (e=="vrai"){
   if(a==1){
    if(m[0][0]=='1'){
     m[0][0]=w;
     affichage ();
     e="faux";
    }
    else{
     n=1;
     i=0;
     j=0;
     x='1';
     erreur ();
    }
   }
   if(a==2){
    if(m[0][1]=='2'){
     m[0][1]=w;
     affichage ();
     e="faux";
    }
    else{
     n=2;
     i=0;
     j=1;
     x='2';
     erreur ();
    }
   }
   if(a==3){
    if(m[0][2]=='3'){
     m[0][2]=w;
     affichage ();
     e="faux";
    }
    else{
     n=3;
     i=0;
     j=2;
     x='3';
     erreur ();
    }
   }
   if(a==4){
    if(m[1][0]=='4'){
     m[1][0]=w;
     affichage ();
     e="faux";
    }
    else{
     n=4;
     i=1;
     j=0;
     x='4';
     erreur ();
    }
   }
   if(a==5){
    if(m[1][1]=='5'){
     m[1][1]=w;
     affichage ();
     e="faux";
    }
    else{
     n=5;
     i=1;
     j=1;
     x='5';
     erreur ();
    }
   }
   if(a==6){
    if(m[1][2]=='6'){
     m[1][2]=w;
     affichage ();
     e="faux";
    }
    else{
     n=6;
     i=1;
     j=2;
     x='6';
     erreur ();
    }
   }
   if(a==7){
    if(m[2][0]=='7'){
     m[2][0]=w;
     affichage ();
     e="faux";
     }
     else{
      n=7;
      i=2;
      j=0;
      x='7';
      erreur ();
      }
    }
    if(a==8){
     if(m[2][1]=='8'){
      m[2][1]=w;
      affichage ();
      e="faux";
      }
     else{
      n=8;
      i=2;
      j=1;
      x='8';
      erreur ();
      }
    }
    if(a==9){
      if(m[2][2]=='9'){
      m[2][2]=w;
      affichage ();
      e="faux";
      }
     else{
      n=9;
      i=2;
      j=2;
      x='9';
      erreur ();
     }
    }
   }
}
void win (){
     if((m[0][0]=='x') && (m[0][1]=='x') && (m[0][2]=='x')){
        p=10;
     }
     else {
     if((m[1][0]=='x') && (m[1][1]=='x') && (m[1][2]=='x')){
     p=10;
     }
     else{
     if((m[2][0]=='x') && (m[2][1]=='x') && (m[2][2]=='x')){
     p=10;
     }
     else{
     if((m[0][0]=='x') && (m[1][0]=='x') && (m[2][0]=='x')){
     p=10;
     }
     else{
     if((m[0][1]=='x') && (m[1][1]=='x') && (m[2][1]=='x')){
     p=10;
     }
     else{
     if((m[0][2]=='x') && (m[1][2]=='x') && (m[2][2]=='x')){
     p=10;
     }
     else{
     if((m[0][0]=='x') && (m[1][1]=='x') && (m[2][2]=='x')){
     p=10;
     }
     else{
     if((m[2][0]=='x') && (m[1][1]=='x') && (m[0][2]=='x')){
     p=10;
     }
     else{
     if((m[0][0]=='o') && (m[0][1]=='o') && (m[0][2]=='o')){
     p=10;
     }
     else{
     if((m[1][0]=='o') && (m[1][1]=='o') && (m[1][2]=='o')){
     p=10;
     }
     else{
     if((m[2][0]=='o') && (m[2][1]=='o') && (m[2][2]=='o')){
     p=10;
     }
     else{
     if((m[0][0]=='o') && (m[1][0]=='o') && (m[2][0]=='o')){
     p=10;
     }
     else{
     if((m[0][1]=='o') && (m[1][1]=='o') && (m[2][1]=='o')){
     p=10;
     }
     else{
     if((m[0][2]=='o') && (m[1][2]=='o') && (m[2][2]=='o')){
     p=10;
     }
     else{
     if((m[0][0]=='o') && (m[1][1]=='o') && (m[2][2]=='o')){
     p=10;
     }
     else{
     if((m[2][0]=='o') && (m[1][1]=='o') && (m[0][2]=='o')){
     p=10;
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
    }
}
void changerlesjoueur(){
      if (w=='x'){
        w='o';
      }
      else{
        w='x';
      }
}
int main ( ){
 cout<<"         ***********  WELCOME to the TIC-TAC-TOE Game  ************   "<<endl<<endl;
  joueur ( );
  bb=j1;
  k=k+1;
  affichage ();
  p=0;
  s=0;
  while (p<9) {
    if (p==0 && k==0){
    joueur ( );
    affichage ( );
    }
    s=s+1;
    p=p+1;
    cout<<endl;
    cout<<"    "<<bb<<"   entrer le numero de case : "<<endl;
    cin>>a;
    out ();
    e="vrai";
  input ();
    if(s>4){
   win();
   }
    if(s>=1){
   changerlesjoueur ();
    }
  if (p==9){
    p=10;
    cout<<"il n'y a pas de gagnant"<<endl;
    rejouer();
  }
  else {
    if((p==10) && (w=='o')){
    cout<<"    le gagnant est : "<<bb<<"    ( x )"<<endl;
    rejouer();
    }
    else {
    if((p==10) && (w=='x')){
    cout<<"    le gagnant est : "<<bb<<"    ( O )"<<endl;
    rejouer();
    }
    }
    }
   if(bb==j1) {
    bb=j2;
   }
   else{
    bb=j1;
   }
  }
  if(p==10){
    cout<<endl<<endl<<endl;
    cout<<"      ##   fin de jeu  ##   "<<endl;
    cout<<endl<<endl<<endl;
  }
}

//Rania Chaib ........G2
