//
//  RCTTWTViewManager.m
//  Jicheng8
//
//  Created by guojicheng on 16/11/14.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "RCTTWTViewManager.h"
#import "RCTTWTView.h"

@implementation RCTTWTViewManager

RCT_EXPORT_MODULE();
@synthesize bridge = _bridge;

-(UIView *)view
{
  return [[RCTTWTView alloc]init];
}

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

@end
