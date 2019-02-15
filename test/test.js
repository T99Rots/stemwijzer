class a {
  constructor() {
    console.log(this);
    setTimeout(this.potato())
  }
}
class b extends a {
  potato() {
    console.log("that's one");
  }
}
class c extends b {
  potato() {
    console.log("that's 2")
  }
}

console.log(new c)