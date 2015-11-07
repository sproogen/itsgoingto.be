<?php

namespace ItsGoingToBeBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

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
    protected $customSessionID = "";

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
    public function updatedTimestamps()
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
     * Set userIP
     *
     * @param string $userIP
     *
     * @return Response
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
     * @return Response
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
     * Set createdAt
     *
     * @param \DateTime $createdAt
     *
     * @return Response
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
     * @return Response
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

    /**
     * Set question
     *
     * @param \ItsGoingToBeBundle\Entity\Question $question
     *
     * @return Response
     */
    public function setQuestion(\ItsGoingToBeBundle\Entity\Question $question = null)
    {
        $this->question = $question;

        return $this;
    }

    /**
     * Get question
     *
     * @return \ItsGoingToBeBundle\Entity\Question
     */
    public function getQuestion()
    {
        return $this->question;
    }

    /**
     * Set answer
     *
     * @param \ItsGoingToBeBundle\Entity\Answer $answer
     *
     * @return Response
     */
    public function setAnswer(\ItsGoingToBeBundle\Entity\Answer $answer = null)
    {
        $this->answer = $answer;

        return $this;
    }

    /**
     * Get answer
     *
     * @return \ItsGoingToBeBundle\Entity\Answer
     */
    public function getAnswer()
    {
        return $this->answer;
    }

    /**
     * Set customSessionID
     *
     * @param string $customSessionID
     *
     * @return UserResponse
     */
    public function setCustomSessionID($customSessionID)
    {
        $this->customSessionID = $customSessionID;

        return $this;
    }

    /**
     * Get customSessionID
     *
     * @return string
     */
    public function getCustomSessionID()
    {
        return $this->customSessionID;
    }
}
