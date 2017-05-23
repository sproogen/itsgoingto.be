<?php

namespace ItsGoingToBeBundle\Twig;

class AutoLinkTwigExtension extends \Twig_Extension
{
    /**
     * {@inheritdoc}
     */
    public function getFilters()
    {
        return array(
            'auto_link_text' => new \Twig_Filter_Method($this, 'autoLinkText', array('is_safe' => array('html'))),
        );
    }

    /**
     * {@inheritdoc}
     */
    public function getName()
    {
        return "auto_link_twig_extension";
    }

    /**
     * Replace any urls with links.
     *
     * @param  string $string
     *
     * @return string
     */
    public static function autoLinkText($string)
    {
        $regexp = "/(<a.*?>)?(https?:\/\/)?(\w+\.)?(\w+)\.(\w+)(<\/a.*?>)?/i";
        $anchorMarkup = "<a href=\"%s%s\" target=\"_blank\" >%s</a>";

        preg_match_all($regexp, $string, $matches, \PREG_SET_ORDER);

        foreach ($matches as $match) {
            if (empty($match[1]) && empty($match[6])) {
                $http = $match[2]?'':'http://';
                $replace = sprintf($anchorMarkup, $http, $match[0], $match[0]);
                $string = str_replace($match[0], $replace, $string);
            }
        }

        return $string;
    }
}
