<?php 
require_once __DIR__ . "/../user/user.php";
class Post { 
    public $id_post; 
    public $user;
    public $text;
    public $postdate;
    
    //----- CONSTRUTOR -----
    function __construct($id_post, $user, $text, $postdate)
    {
        $this->id_post = $id_post;
        $this->user = $user;
        $this->text = $text;
        $this->postdate = $postdate;
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
    function postToString()
    {
        $id_post = $this->getAttribute('id_post');
        $user = $this->getAttribute('user')->userToString();
        $text = $this->getAttribute('text');
        $postdate = $this->getAttribute('postdate');
        return "Post=[id_post:$id_post; user:$user; text: $text; postdate:$postdate]"; 
    }
    
    //----- TO SELECT ITEM -----
    function toSelectItem()
    {
        $id_post = $this->getAttribute('id_post');
        $text = $this->getAttribute('text');
        return "<option value='$id_post'>$text</option>"; 
    }
    
} 

?> 