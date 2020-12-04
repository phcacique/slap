<?php 
require_once __DIR__ . "/../user/user.php";
class Storyboard { 
    public $id_storyboard; 
    public $title;
    public $description;
    public $avatar;
    public $user;
    public $lastupdate;
    public $fps;
    public $frame_format;
    public $frames;
    
    //----- CONSTRUTOR -----
    function __construct($id_storyboard, $title, $description, $avatar, $user, $lastupdate, $fps, $frame_format)
    {
        $this->id_storyboard = $id_storyboard;
        $this->title = $title;
        $this->description = $description;
        $this->avatar = $avatar;
        $this->user = $user;
        $this->lastupdate = $lastupdate;
        $this->fps = $fps;
        $this->frame_format = $frame_format;
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
    function storyboardToString()
    {
        $id_storyboard = $this->getAttribute('id_storyboard');
        $title = $this->getAttribute('title');
        $description = $this->getAttribute('description');
        $avatar = $this->getAttribute('avatar');
        $user = $this->getAttribute('user');
        $lastupdate = $this->getAttribute('lastupdate');
        $fps = $this->getAttribute('fps');
        $frame_format = $this->getAttribute('frame_format');
        return "Storyboard=[id_atoryboard:$id_storyboard; title: $title; description: $description;  avatar:$avatar; user:".$user->userToString()."; lastupdate: $lastupdate; fps: $fps; frame_format: $frame_format]"; 
    }
    
    //----- TO SELECT ITEM -----
    function toSelectItem()
    {
        $id_storyboard = $this->getAttribute('id_storyboard');
        $title = $this->getAttribute('title');
        return "<option value='$id_storyboard'>$title</option>"; 
    }
    
} 

?> 