pragma solidity ^0.4.17;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Arrendar.sol";

contract TestArrendar {
    Arrendar arrendar = Arrendar(DeployedAddresses.Arrendar());

    //Testing the constructor function
    function testAddOwner() public {
        string memory nombre = "Pepito";
        arrendar.arrendamiento("El mejor apartamento", 500, 250, nombre, false, false);

        address expected = this;
        address id = arrendar.getID();

        Assert.equal(address(id), address(expected), "Owner of the apartment should be recorded.");
    }

    //Testing retrieval of a single pet's owner
    function testAgregarInvitado() public {
        //Expected owner is this contract
        arrendar.arrendar(750, "Hugo", false, false);

        var expectedN = "Hugo";
        var name = arrendar.getName();

        Assert.equal(name, expectedN, "Guest should be recorded.");
    }

    //Testing retrieval of all pet owners
    function testSancionarInvitado() public {
        //Expected owner is this contract
        arrendar.sancionar();

        var expectedT = 740;
        var token = arrendar.getToken();

        Assert.equal(uint(token), uint(expectedT), "Guest should have less money.");
    }
}