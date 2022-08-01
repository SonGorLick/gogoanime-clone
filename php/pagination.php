<?php
class PaginationLinks{

  public static function create(
      $page,
      $numberOfPages,
      $context    = 1,
      $linkFormat = '<a href="?page=%d">%d</a>',
      $pageFormat = '<span>%d</span>',
      $ellipsis   = '&hellip;'){

    $ranges = array(array(1, 1 + $context));
    self::mergeRanges($ranges, $page   - $context, $page + $context);
    self::mergeRanges($ranges, $numberOfPages - $context, $numberOfPages);

    $links = array();


    foreach ($ranges as $range){


      if (count($links) > 0) $links[] = $ellipsis;


      $links =
          array_merge(
              $links,
              self::createLinks($range, $page, $linkFormat, $pageFormat));

    }

    return implode(' ' , $links);

  }

  private static function mergeRanges(&$ranges, $start, $end){

    $endOfPreviousRange =& $ranges[count($ranges) - 1][1];

    if ($start <= $endOfPreviousRange + 1){
      $endOfPreviousRange = $end;
    }else{
      $ranges[] = array($start, $end);
    }

  }

  private static function createLinks($range, $page, $linkFormat, $pageFormat){

    $links = array();


    for ($index = $range[0]; $index <= $range[1]; $index ++){
      $links[] =
          sprintf(
              ($index == $page ? $pageFormat : $linkFormat),
              $index,
              $index);
    }


    return $links;

  }

}

?>
