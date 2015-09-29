<?php

namespace ItsGoingToBeBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="sessions")
 */
class Session
{
	/**
     * @ORM\Column(type="string")
     * @ORM\Id
     */
    protected $sess_id;


    /**
     * @ORM\Column(type="blob")
     */
    protected $sess_data;

    /**
     * @ORM\Column(type="integer")
     */
    protected $sess_time;

    /**
     * @ORM\Column(type="bigint")
     */
    protected $sess_lifetime;

    /**
     * Set sessId
     *
     * @param string $sessId
     *
     * @return Session
     */
    public function setSessId($sessId)
    {
        $this->sess_id = $sessId;

        return $this;
    }

    /**
     * Get sessId
     *
     * @return string
     */
    public function getSessId()
    {
        return $this->sess_id;
    }

    /**
     * Set sessData
     *
     * @param string $sessData
     *
     * @return Session
     */
    public function setSessData($sessData)
    {
        $this->sess_data = $sessData;

        return $this;
    }

    /**
     * Get sessData
     *
     * @return string
     */
    public function getSessData()
    {
        return $this->sess_data;
    }

    /**
     * Set sessTime
     *
     * @param integer $sessTime
     *
     * @return Session
     */
    public function setSessTime($sessTime)
    {
        $this->sess_time = $sessTime;

        return $this;
    }

    /**
     * Get sessTime
     *
     * @return integer
     */
    public function getSessTime()
    {
        return $this->sess_time;
    }

    /**
     * Set sessLifetime
     *
     * @param integer $sessLifetime
     *
     * @return Session
     */
    public function setSessLifetime($sessLifetime)
    {
        $this->sess_lifetime = $sessLifetime;

        return $this;
    }

    /**
     * Get sessLifetime
     *
     * @return integer
     */
    public function getSessLifetime()
    {
        return $this->sess_lifetime;
    }
}
