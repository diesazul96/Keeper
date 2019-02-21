pragma solidity ^0.4.17;

contract Arrendar{

    uint256 deposito = 0;
    function () public payable{
        deposito += msg.value;
    }

    struct Domo{
        string descripcion;
        uint precio;
        uint alcancia;
        uint fecha;
        bool pet;
        bool kid;
        mapping(address => Invitado) invitados;
        address anfi;
        address[] dirs;
    }
    
    struct Invitado{
        string nombre;
        uint token;
        bool pets;
        bool kids;
        uint points;
    }
    
    struct Anfitrion{
        string nombre;
        uint token;
        address id;
    }

    Anfitrion public anfitrion;
    Domo public domo;
    
    function arrendamiento(string _descripcion, uint _precio, uint _alcancia, string _nombre, bool _pet, bool _kid) public {
        anfitrion = Anfitrion(_nombre, 0, msg.sender);

        domo.descripcion = _descripcion;
        domo.precio = _precio;
        domo.alcancia = _alcancia;
        domo.fecha = now;
        domo.pet = _pet;
        domo.kid = _kid;
        domo.anfi = msg.sender;
    }

    function getDesc() public returns(string){
        return domo.descripcion;
    }

    function getPrecio() public returns(uint){
        return domo.precio;
    }

    function getAlcancia() public returns(uint){
        return domo.alcancia;
    }

    function getFecha() public returns(uint){
        return domo.fecha;
    }

    function getPet() public returns(bool){
        return domo.pet;
    }

    function getKid() public returns(bool){
        return domo.kid;
    }

    function getID() public returns(address){
        return anfitrion.id;
    }

    function getNombre() public returns(string){
        return anfitrion.nombre;
    }

    function getName() public returns(string){
        return domo.invitados[msg.sender].nombre;
    }

    function getToken() public returns(uint256){
        return deposito;
    }

    function getAlcanciaEth() public returns(uint256){
        var min = (domo.precio + domo.alcancia) * 1 ether;
        return min;
    }

    function balanceInv() public returns(uint256){
        return msg.sender.balance;
    }

    function numPipol() public returns(uint){
        return domo.dirs.length;
    }

    function getPoints() public returns(uint){
        return domo.invitados[msg.sender].points;
    }

    function setPoints(uint point) public{
        var inv = domo.invitados[msg.sender];
        inv.points = point;
    }

    function _solicitar(bool _mascota, bool _ninio, address owner) private returns(bool) {
        var min = (domo.precio + domo.alcancia) * 1 ether;

        if (domo.pet == _mascota && domo.kid == _ninio && owner.balance >= min) {
            return true;
        } else {
            return false;
        }
    }

    function arrendar(string _nombre, bool _pet, bool _kid) public {
        require(_solicitar(_pet, _kid, msg.sender));

        var guest = domo.invitados[msg.sender];
        guest.nombre = _nombre;
        guest.token = msg.sender.balance;
        guest.pets = _pet;
        guest.kids = _kid;
        guest.points = 5;
        domo.dirs.push(msg.sender);
        deposito -= (domo.precio/2) * 1 ether;
        anfitrion.id.transfer(((domo.precio/2) * 1 ether));
    }
    
    function sancionar() public returns(uint256){
        uint256 sancion = 1;
        require(deposito >= sancion);

        deposito -= (sancion * 1 ether);
        anfitrion.id.transfer((sancion * 1 ether));

        var guest = domo.invitados[msg.sender];
        guest.points -= 1;

        return deposito;
    }

}