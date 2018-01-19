<?php

namespace ItsGoingToBeBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

/**
 * Entity to store a user.
 */
class User implements UserInterface
{
    /**
     * The id of this Entity.
     *
     * @var integer
     */
    protected $id;

    /**
     * A username for this user.
     *
     * @var string
     */
    protected $username;

    /**
     * The password for this user.
     *
     * @var string
     */
    protected $password;

    /**
     * The plain password for encryption
     *
     * @var string
     */
    protected $plainPassword;

    /**
     * When this Entity was created.
     *
     * @var \DateTime
     */
    protected $created;

    /**
     * When this Entity was last updated.
     *
     * @var \DateTime
     */
    protected $updated;

    /**
     * Lifecycle callback method for the 'prePersist' event.
     *
     * Sets the $created and $updated dates to now.
     */
    public function prePersist()
    {
        $this->setCreated();
        $this->setUpdated();
    }

    /**
     * Lifecycle callback method for the 'preUpdate' event.
     *
     * Sets the $updated date to now.
     */
    public function preUpdate()
    {
        $this->setUpdated();
    }

    /**
     * Extract the data for the poll
     *
     * @return []
     */
    public function extract()
    {
        $data = [
            'id'             => $this->getId(),
            'username'       => $this->getUsername(),
            'created'        => $this->getCreated(),
            'updated'        => $this->getUpdated()
        ];

        return $data;
    }

    public function getRoles()
    {
        return array('ROLE_USER', 'ROLE_ADMIN');
    }

    public function getSalt()
    {
        return null;
    }

    public function eraseCredentials()
    {
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
     * Set username
     *
     * @param string $username
     *
     * @return User
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
     * @return User
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
     * Set plainPassword
     *
     * @param string $plainPassword
     *
     * @return User
     */
    public function setPlainPassword($plainPassword)
    {
        $this->plainPassword = $plainPassword;

        return $this;
    }

    /**
     * Get plainPassword
     *
     * @return string
     */
    public function getPlainPassword()
    {
        return $this->plainPassword;
    }

    /**
     * Add answer
     *
     * @param Answer $answer
     *
     * @return Poll
     */
    public function addAnswer(Answer $answer)
    {
        $answer->setPoll($this);
        $this->answers[] = $answer;

        return $this;
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
     * @return Poll
     */
    public function setCreated($created = null)
    {
        if (is_null($created)) {
            $created = new \DateTime();
        }

        $this->created = $created;
        return $this;
    }

    /**
     * Get when this Entity was last updated.
     *
     * @return \DateTime
     */
    public function getUpdated()
    {
        return $this->updated;
    }

    /**
     * Set when this Entity was last updated.
     *
     * Sets it to now if no $updated value is passed.
     *
     * @param \DateTime $updated When this Entity was last updated.
     *
     * @return Poll
     */
    public function setUpdated($updated = null)
    {
        if (is_null($updated)) {
            $updated = new \DateTime();
        }

        $this->updated = $updated;
    }
}
