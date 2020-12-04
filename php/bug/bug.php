<?php 
require_once __DIR__ . "/../user/user.php";
class Bug { 
    public $id_bug; 
    public $subject;
    public $detailedText;
    public $bugdate;
    public $user;
    
    //----- CONSTRUTOR -----
    function __construct($id_bug, $subject, $detailedText, $bugdate, $user)
    {
        $this->id_bug = $id_bug;
        $this->subject = $subject;
        $this->detailedText = $detailedText;
        $this->bugdate = $bugdate;
        $this->user = $user;
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
    function bugToString()
    {
        $id_bug = $this->getAttribute('id_bug');
        $subject = $this->getAttribute('subject');
        $detailedText = $this->getAttribute('detailedText');
        $bugdate = $this->getAttribute('bugdate');
        $user = $this->getAttribute('user')->userToString();
        
        return "Bug=[id_bug: $id_bug, subject: $subject; detailedText: $detailedText; bugdate: $bugdate; user: $user]"; 
    }
    
    //----- TO SELECT ITEM -----
    function bugToSelectItem()
    {
        $id_bug = $this->getAttribute('id_bug');
        $subject = $this->getAttribute('subject');
        $user = $this->getAttribute('user')->getAttribute('username');
        return "<option value='$id_bug'>$user - $subject</option>"; 
    }
    
} 

?> 