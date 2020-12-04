<?php 
class User { 
    public $id_appuser; 
    public $username;
    public $password;
    public $usertype;
    public $email;
    public $avatar;  
    //----- CONSTRUTOR -----
    function __construct($id_appuser, $username, $password, $usertype, $email, $fullname, $avatar)
    {
        $this->id_appuser = $id_appuser;
        $this->username = $username;
        $this->password = $password;
        $this->usertype = $usertype;
        $this->email = $email;
        $this->fullname = $fullname;
        $this->avatar = $avatar;
    }
    //----- GETTERS AND SETTERS -----
    function getAttribute($attributeName)
    {
       return $this->$attributeName;
    }
    function setAttribute($attributeName, $value)
    {
        $this->$attributeName = $value;
    }
    //----- TO STRING -----
    function userToString()
    {
        $id_appuser = $this->getAttribute('id_appuser');
        $username = $this->getAttribute('username');
        $password = $this->getAttribute('password');
        $email = $this->getAttribute('email');
        $usertype = $this->getAttribute('usertype');
        $fullname = $this->getAttribute('fullname');
        $avatar = $this->getAttribute('avatar');
        return "User=[id_userapp:$id_appuser; username:$username; password:$password; fullname:$fullname; email:$email; usertype:$usertype; avatar:$avatar]"; 
    }
    //----- TO SELECT ITEM -----
    function toSelectItem()
    {
        $id_appuser = $this->getAttribute('id_appuser');
        $username = $this->getAttribute('username');
        return "<option value='$id_appuser'>$username</option>"; 
    }  
}?> 