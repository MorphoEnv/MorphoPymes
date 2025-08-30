// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Test.sol";
import "./MoPy.sol";

contract MoPyTest is Test {
    MoPy public token;
    address public owner;
    address public minter;
    address public user1;
    address public user2;

    function setUp() public {
        owner = address(this);
        minter = address(0x123);
        user1 = address(0x456);
        user2 = address(0x789);
        
        token = new MoPy(minter);
    }

    function testTokenInitialization() public view {
        assertEq(token.name(), "MoPy Token");
        assertEq(token.symbol(), "MPY");
        assertEq(token.decimals(), 18);
        assertEq(token.totalSupply(), 0);
        assertEq(token.minterContract(), minter);
    }

    function testMintSuccess() public {
        vm.prank(minter);
        token.mint(user1, 1000 ether);
        
        assertEq(token.balanceOf(user1), 1000 ether);
        assertEq(token.totalSupply(), 1000 ether);
    }

    function testMintFailsFromNonMinter() public {
        vm.expectRevert("MoPy: caller is not the authorized minter");
        token.mint(user1, 1000 ether);
    }

    function testBurnSuccess() public {
        vm.prank(minter);
        token.mint(user1, 1000 ether);
        
        vm.prank(minter);
        token.burn(user1, 500 ether);
        
        assertEq(token.balanceOf(user1), 500 ether);
        assertEq(token.totalSupply(), 500 ether);
    }

    function testBurnFailsFromNonMinter() public {
        vm.prank(minter);
        token.mint(user1, 1000 ether);
        
        vm.expectRevert("MoPy: caller is not the authorized minter");
        token.burn(user1, 500 ether);
    }

    function testUpdateMinterContract() public {
        address newMinter = address(0x999);
        
        token.updateMinterContract(newMinter);
        assertEq(token.minterContract(), newMinter);
    }

    function testUpdateMinterFailsFromNonOwner() public {
        address newMinter = address(0x999);
        
        vm.prank(user1);
        vm.expectRevert();
        token.updateMinterContract(newMinter);
    }

    function testCannotMintToZeroAddress() public {
        vm.prank(minter);
        vm.expectRevert("MoPy: cannot mint to zero address");
        token.mint(address(0), 1000 ether);
    }

    function testCannotBurnFromZeroAddress() public {
        vm.prank(minter);
        vm.expectRevert("MoPy: cannot burn from zero address");
        token.burn(address(0), 1000 ether);
    }
}