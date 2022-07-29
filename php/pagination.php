<?php

/*

class.PaginationLinks.php

A class containing functions for creating pagination links

Created by Kate Morley - http://iamkate.com/ - and released under the terms of
the CC0 1.0 Universal legal code:

http://creativecommons.org/publicdomain/zero/1.0/legalcode

*/

// A class containing functions for creating pagination links.
class PaginationLinks{

  public static function create(
      $page,
      $numberOfPages,
      $context    = 1,
      $linkFormat = '<a href="?page=%d">%d</a>',
      $pageFormat = '<span>%d</span>',
      $ellipsis   = '&hellip;'){

    // create the list of ranges
    $ranges = array(array(1, 1 + $context));
    self::mergeRanges($ranges, $page   - $context, $page + $context);
    self::mergeRanges($ranges, $numberOfPages - $context, $numberOfPages);

    // initialise the list of links
    $links = array();

    // loop over the ranges
    foreach ($ranges as $range){

      // if there are preceeding links, append the ellipsis
      if (count($links) > 0) $links[] = $ellipsis;

      // merge in the new links
      $links =
          array_merge(
              $links,
              self::createLinks($range, $page, $linkFormat, $pageFormat));

    }

    // return the links
    return implode(' ' , $links);

  }

  /* Merges a new range into a list of ranges, combining neighbouring ranges.
   * The parameters are:
   *
   * $ranges - the list of ranges
   * $start  - the start of the new range
   * $end    - the end of the new range
   */
  private static function mergeRanges(&$ranges, $start, $end){

    // determine the end of the previous range
    $endOfPreviousRange =& $ranges[count($ranges) - 1][1];

    // extend the previous range or add a new range as necessary
    if ($start <= $endOfPreviousRange + 1){
      $endOfPreviousRange = $end;
    }else{
      $ranges[] = array($start, $end);
    }

  }

  /* Create the links for a range. The parameters are:
   *
   * $range      - the range
   * $page       - the current page
   * $linkFormat - the format for links
   * $pageFormat - the format for the current page
   */
  private static function createLinks($range, $page, $linkFormat, $pageFormat){

    // initialise the list of links
    $links = array();

    // loop over the pages, adding their links to the list of links
    for ($index = $range[0]; $index <= $range[1]; $index ++){
      $links[] =
          sprintf(
              ($index == $page ? $pageFormat : $linkFormat),
              $index,
              $index);
    }

    // return the array of links
    return $links;

  }

}

?>
