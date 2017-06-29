<?php

namespace ItsGoingToBeBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;

/**
 * Entity to store login attempts
 */
class LoginAttempt
{
    /**
     * The id of this Entity.
     *
     * @var integer
     */
    protected $id;

    /**
     * The id of this Entity.
     *
     * @var integer
     */
    protected $ip;

    /**
     * Whether the login attempt was succesful.
     *
     * @var boolean
     */
    protected $succesful;

    /**
     * The username used for the login.
     *
     * @var string
     */
    protected $username;

    /**
     * The password used for the login, empty string if login was succesful.
     *
     * @var string
     */
    protected $password = "";

    /**
     * When this Entity was created.
     *
     * @var \DateTime
     */
    protected $created;

    /**
     * Lifecycle callback method for the 'prePersist' event.
     *
     * Sets the $created dates to now.
     */
    public function prePersist()
    {
        $this->setCreated();
    }

    /**
     * Get id
     *
     * @return integer
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set ip
     *
     * @param string $ip
     *
     * @return LoginAttempt
     */
    public function setIp($ip)
    {
        $this->ip = $ip;

        return $this;
    }

    /**
     * Get ip
     *
     * @return string
     */
    public function getIp()
    {
        return $this->ip;
    }

    /**
     * Set succesful
     *
     * @param boolean $succesful
     *
     * @return LoginAttempt
     */
    public function setSuccesful($succesful)
    {
        $this->succesful = $succesful;

        return $this;
    }

    /**
     * Get succesful
     *
     * @return boolean
     */
    public function isSuccesful()
    {
        return $this->succesful;
    }

    /**
     * Set username
     *
     * @param string $username
     *
     * @return LoginAttempt
     */
    public function setUsername($username)
    {
        $this->username = $username;

        return $this;
    }

    /**
     * Get username
     *
     * @return string
     */
    public function getUsername()
    {
        return $this->username;
    }

    /**
     * Set password
     *
     * @param string $password
     *
     * @return LoginAttempt
     */
    public function setPassword($password)
    {
        $this->password = $password;

        return $this;
    }

    /**
     * Get password
     *
     * @return string
     */
    public function getPassword()
    {
        return $this->password;
    }

    /**
     * Get when this Entity was created.
     *
     * @return \DateTime
     */
    public function getCreated()
    {
        return $this->created;
    }

    /**
     * Set when this Entity was created.
     *
     * Sets it to now if no $created value is passed.
     *
     * @param \DateTime $created When this Entity was created.
     *
     * @return Entity
     */
    public function setCreated($created = null)
    {
        if (is_null($created)) {
            $created = new \DateTime();
        }

        $this->created = $created;
        return $this;
    }
}
