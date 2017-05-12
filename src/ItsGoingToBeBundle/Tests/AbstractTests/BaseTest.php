<?php

namespace ItsGoingToBeBundle\Tests\AbstractTests;

use Doctrine\ORM\EntityManager;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
//use Simitive\TestBundle\Database\DummyEntityController;

// use Simitive\TaxonomyBundle\Entity\Taxonomy;
// use Simitive\SolrBundle\Model\SearchTerm;

abstract class BaseTest extends WebTestCase
{
    /**
     * The entity manager.
     *
     * @var EntityManager
     */
    protected $em;

    /**
     * A canonical \DateTime for this test.
     *
     * @var \DateTime
     */
    protected $now;

    /**
     * Test setup.
     */
    public function setUp()
    {
        self::bootKernel();

        $this->container = self::$kernel->getContainer();
        $this->em        = $this->container->get('doctrine')->getManager();
        //var_dump($this->em);
        //die();
        $this->now       = new \DateTime();
    }

    /**
     * Test tear down.
     */
    protected function tearDown()
    {
        //DummyEntityController::purgeEntities($this->em);
        $this->em->getConnection()->close();
        $this->em->close();
        $this->em = null;

        gc_collect_cycles();
    }
}