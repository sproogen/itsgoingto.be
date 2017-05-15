<?php

namespace ItsGoingToBeBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use ItsGoingToBeBundle\Entity\Answer;
use ItsGoingToBeBundle\Entity\Question;

/**
 * @ORM\Entity
 * @ORM\HasLifecycleCallbacks
 * @ORM\Table(name="response")
 */
class UserResponse
{
	/**
     * @ORM\Column(type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\ManyToOne(targetEntity="Question", inversedBy="responses")
     * @ORM\JoinColumn(name="question_id", referencedColumnName="id")
     */
    protected $question;

    /**
     * @ORM\ManyToOne(targetEntity="Answer", inversedBy="responses")
     * @ORM\JoinColumn(name="answer_id", referencedColumnName="id")
     */
    protected $answer;

    /**
     * @ORM\Column(type="string", length=100)
     */
    protected $userIP;

    /**
     * @ORM\Column(type="string", length=100)
     */
    protected $userSessionID;

    /**
     * @ORM\Column(type="string", length=100)
     */
    protected $customUserID = "";

    /**
     * @ORM\Column(type="datetime")
     */
    protected $created_at;

    /**
     * @ORM\Column(type="datetime")
     */
    protected $updated_at;

    /**
     * @ORM\PrePersist
     * @ORM\PreUpdate
     */
    public function updateTimestamps()
    {
        if($this->getCreatedAt() == null)
        {
            $this->setCreatedAt(new \DateTime(date('Y-m-d H:i:s')));
        }
        $this->setUpdatedAt(new \DateTime(date('Y-m-d H:i:s')));
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
     * Set createdAt
     *
     * @param \DateTime $createdAt
     *
     * @return UserResponse
     */
    public function setCreatedAt($createdAt)
    {
        $this->created_at = $createdAt;

        return $this;
    }

    /**
     * Get createdAt
     *
     * @return \DateTime
     */
    public function getCreatedAt()
    {
        return $this->created_at;
    }

    /**
     * Set updatedAt
     *
     * @param \DateTime $updatedAt
     *
     * @return UserResponse
     */
    public function setUpdatedAt($updatedAt)
    {
        $this->updated_at = $updatedAt;

        return $this;
    }

    /**
     * Get updatedAt
     *
     * @return \DateTime
     */
    public function getUpdatedAt()
    {
        return $this->updated_at;
    }
}
