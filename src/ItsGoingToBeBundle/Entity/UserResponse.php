<?php

namespace ItsGoingToBeBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Event\LifecycleEventArgs;
use ItsGoingToBeBundle\Entity\Answer;
use ItsGoingToBeBundle\Entity\Question;

/**
 * Entity to store an answer for a users response.
 */
class UserResponse
{
    /**
     * The id of this Entity.
     *
     * @var integer
     */
    protected $id;

    /**
     * The question for this response.
     *
     * @var Question
     */
    protected $question;

    /**
     * The answer for this response.
     *
     * @var Answer
     */
    protected $answer;

    /**
     * The ip of the user for the response.
     *
     * @var string
     */
    protected $userIP;

    /**
     * The session id of the user for the response.
     *
     * @var string
     */
    protected $userSessionID;

    /**
     * A custom id for the user for the response.
     *
     * @var string
     */
    protected $customUserID = "";

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
     *
     * @param LifecycleEventArgs $args Args for this Lifecycle event, passed in by Doctrine.
     */
    public function prePersist(LifecycleEventArgs $args)
    {
        $this->setCreated();
        $this->setUpdated();
    }

    /**
     * Lifecycle callback method for the 'preUpdate' event.
     *
     * Sets the $updated date to now.
     *
     * @param LifecycleEventArgs $args Args for this Lifecycle event, passed in by Doctrine.
     */
    public function preUpdate(LifecycleEventArgs $args)
    {
        $this->setUpdated();
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
     * Set question
     *
     * @param Question $question
     *
     * @return UserResponse
     */
    public function setQuestion(Question $question = null)
    {
        $this->question = $question;

        return $this;
    }

    /**
     * Get question
     *
     * @return Question
     */
    public function getQuestion()
    {
        return $this->question;
    }

    /**
     * Set answer
     *
     * @param Answer $answer
     *
     * @return UserResponse
     */
    public function setAnswer(Answer $answer = null)
    {
        $this->answer = $answer;

        return $this;
    }

    /**
     * Get answer
     *
     * @return Answer
     */
    public function getAnswer()
    {
        return $this->answer;
    }

    /**
     * Set userIP
     *
     * @param string $userIP
     *
     * @return UserResponse
     */
    public function setUserIP($userIP)
    {
        $this->userIP = $userIP;

        return $this;
    }

    /**
     * Get userIP
     *
     * @return string
     */
    public function getUserIP()
    {
        return $this->userIP;
    }

    /**
     * Set userSessionID
     *
     * @param string $userSessionID
     *
     * @return UserResponse
     */
    public function setUserSessionID($userSessionID)
    {
        $this->userSessionID = $userSessionID;

        return $this;
    }

    /**
     * Get userSessionID
     *
     * @return string
     */
    public function getUserSessionID()
    {
        return $this->userSessionID;
    }

    /**
     * Set customUserID
     *
     * @param string $customUserID
     *
     * @return UserResponse
     */
    public function setCustomUserID($customUserID)
    {
        $this->customUserID = $customUserID;

        return $this;
    }

    /**
     * Get customUserID
     *
     * @return string
     */
    public function getCustomUserID()
    {
        return $this->customUserID;
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
     * @return Entity
     */
    public function setUpdated($updated = null)
    {
        if (is_null($updated)) {
            $updated = new \DateTime();
        }

        $this->updated = $updated;
    }
}
